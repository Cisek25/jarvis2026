#!/usr/bin/env python3
"""
CrewAI IdoBooking Website Builder
Pipeline: Paleta CSS → Tresc → HTML → Audit UX → Deploy
"""

import argparse
import os
import sys
import yaml
from pathlib import Path

try:
    from crewai import Agent, Task, Crew, Process
except ImportError:
    print("BLAD: CrewAI nie zainstalowane. Uruchom: ./install.sh")
    sys.exit(1)


# ============================================================
# Konfiguracja
# ============================================================

BASE_DIR = Path(__file__).parent
CONFIG_DIR = BASE_DIR / "config"
PROJECTS_DIR = BASE_DIR / "projects"
OUTPUT_DIR = BASE_DIR / "output"
TEMPLATES_DIR = BASE_DIR / "templates"


def load_yaml(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_project_config(project_name: str) -> dict:
    """Wczytaj konfiguracje projektu z projects/{name}/config.yaml"""
    config_path = PROJECTS_DIR / project_name / "config.yaml"
    if not config_path.exists():
        print(f"BLAD: Brak konfiguracji projektu: {config_path}")
        print(f"Stworz plik: projects/{project_name}/config.yaml")
        print(f"Przyklad: projects/madera/config.yaml")
        sys.exit(1)
    return load_yaml(config_path)


# ============================================================
# Tworzenie agentow
# ============================================================

def create_agents(agents_config: dict) -> dict:
    """Tworzy agentow CrewAI z konfiguracji YAML."""
    agents = {}
    for name, cfg in agents_config.items():
        agents[name] = Agent(
            role=cfg["role"],
            goal=cfg["goal"],
            backstory=cfg["backstory"],
            verbose=cfg.get("verbose", True),
            allow_delegation=cfg.get("allow_delegation", False),
        )
    return agents


# ============================================================
# Tworzenie zadan
# ============================================================

def create_tasks(
    tasks_config: dict,
    agents: dict,
    project_cfg: dict,
    page_name: str | None = None,
) -> list[Task]:
    """Tworzy zadania CrewAI z konfiguracji YAML + zmienne projektu."""

    # Zmienne do interpolacji w opisach zadan
    variables = {
        "project_name": project_cfg["project_name"],
        "css_prefix": project_cfg["css_prefix"],
        "design_style": project_cfg.get("design_style", "nowoczesny, ciepły"),
        "brand_colors": project_cfg.get("brand_colors", "brak"),
        "property_description": project_cfg.get("property_description", ""),
        "language": project_cfg.get("language", "pl"),
        "client_id": project_cfg.get("client_id", ""),
        "subpage_id": project_cfg.get("subpage_id", ""),
        "page_name": page_name or project_cfg.get("default_page", "index"),
        "page_type": project_cfg.get("page_type", "landing"),
        "property_info": project_cfg.get("property_info", ""),
        "sections": project_cfg.get("sections", "hero, intro, features, gallery, cta"),
        "section_template": project_cfg.get("section_template", "standard"),
    }

    created_tasks = {}
    task_list = []

    for task_name, cfg in tasks_config.items():
        # Interpoluj zmienne w opisie
        description = cfg["description"].format(**variables)
        expected_output = cfg["expected_output"].format(**variables)
        output_file = cfg.get("output_file", "").format(**variables) if cfg.get("output_file") else None

        # Kontekst (zależności od innych zadan)
        context = []
        for ctx_name in cfg.get("context", []):
            if ctx_name in created_tasks:
                context.append(created_tasks[ctx_name])

        # Znajdz agenta
        agent_name = cfg["agent"]
        if agent_name not in agents:
            print(f"WARN: Agent '{agent_name}' nie znaleziony, pomijam zadanie '{task_name}'")
            continue

        task = Task(
            description=description,
            expected_output=expected_output,
            agent=agents[agent_name],
            context=context if context else None,
            output_file=output_file,
        )
        created_tasks[task_name] = task
        task_list.append(task)

    return task_list


# ============================================================
# Pipeline
# ============================================================

TASK_ALIASES = {
    "css-palette": ["design_palette"],
    "content-pl": ["write_content"],
    "html-build": ["build_html"],
    "ux-audit": ["audit_ux"],
    "deploy-prep": ["prepare_deploy"],
    "full": None,  # wszystkie
}


def filter_tasks(tasks_config: dict, task_filter: str | None) -> dict:
    """Filtruj zadania wg aliasu CLI."""
    if task_filter is None or task_filter == "full":
        return tasks_config

    if task_filter not in TASK_ALIASES:
        print(f"BLAD: Nieznane zadanie '{task_filter}'")
        print(f"Dostepne: {', '.join(TASK_ALIASES.keys())}")
        sys.exit(1)

    allowed = TASK_ALIASES[task_filter]
    return {k: v for k, v in tasks_config.items() if k in allowed}


# ============================================================
# CLI
# ============================================================

def main():
    parser = argparse.ArgumentParser(
        description="CrewAI IdoBooking Website Builder",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Przyklady:
  python main.py --project madera                 # pelny pipeline
  python main.py --project madera --task css-palette  # tylko paleta
  python main.py --project madera --task ux-audit     # tylko audit
  python main.py --project madera --page galeria      # strona galerii
  python main.py --list-projects                      # lista projektow
        """,
    )
    parser.add_argument("--project", "-p", help="Nazwa projektu (folder w projects/)")
    parser.add_argument("--task", "-t", help="Konkretne zadanie do uruchomienia", choices=list(TASK_ALIASES.keys()))
    parser.add_argument("--page", help="Nazwa strony (default: z config.yaml)")
    parser.add_argument("--list-projects", action="store_true", help="Lista dostepnych projektow")
    parser.add_argument("--dry-run", action="store_true", help="Pokaz plan bez uruchamiania")

    args = parser.parse_args()

    # Lista projektow
    if args.list_projects:
        print("\nDostepne projekty:")
        if PROJECTS_DIR.exists():
            for d in sorted(PROJECTS_DIR.iterdir()):
                if d.is_dir() and (d / "config.yaml").exists():
                    cfg = load_yaml(d / "config.yaml")
                    print(f"  {d.name:20s} — {cfg.get('property_description', '')[:60]}")
        else:
            print("  (brak — stworz folder projects/<nazwa>/config.yaml)")
        return

    if not args.project:
        parser.print_help()
        return

    # Laduj konfiguracje
    print(f"\n=== CrewAI IdoBooking: {args.project} ===\n")

    project_cfg = load_project_config(args.project)
    agents_config = load_yaml(CONFIG_DIR / "agents.yaml")
    tasks_config = load_yaml(CONFIG_DIR / "tasks.yaml")

    # Filtruj zadania
    tasks_config = filter_tasks(tasks_config, args.task)

    # Stworz folder output
    output_path = OUTPUT_DIR / args.project
    output_path.mkdir(parents=True, exist_ok=True)

    # Tworzenie agentow i zadan
    agents = create_agents(agents_config)
    tasks = create_tasks(tasks_config, agents, project_cfg, page_name=args.page)

    if not tasks:
        print("BLAD: Brak zadan do wykonania.")
        return

    # Dry run
    if args.dry_run:
        print("PLAN WYKONANIA:")
        for i, task in enumerate(tasks, 1):
            print(f"  {i}. [{task.agent.role}] {task.description[:80]}...")
        print(f"\nOutput: {output_path}/")
        return

    # Uruchom crew
    crew = Crew(
        agents=list(agents.values()),
        tasks=tasks,
        process=Process.sequential,
        verbose=True,
    )

    print(f"Uruchamiam {len(tasks)} zadan...\n")
    result = crew.kickoff()

    print("\n=== WYNIK ===")
    print(result)
    print(f"\nPliki w: {output_path}/")


if __name__ == "__main__":
    main()
