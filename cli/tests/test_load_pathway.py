import pytest
from click.testing import CliRunner
from commands.pathway import load_pathway
import shutil
from pathlib import Path

PATHWAY_ID = "hsa04210"

# Ruta temporal para simular archivos de prueba
test_data_dir = Path("tests/test_data/pathways")
test_data_dir.mkdir(parents=True, exist_ok=True)

# Crear archivos falsos para pruebas
(test_data_dir /  f"hsa{PATHWAY_ID}_nodes.tsv").write_text("id\tname\n1\tA")
(test_data_dir /  f"hsa{PATHWAY_ID}_relations.tsv").write_text("src\tdst\ttype\n1\t2\trel")
(test_data_dir /  f"hsa_metadata.tsv").write_text("key\tvalue\nname\ttest")

@pytest.fixture
def runner():
    return CliRunner()

def test_load_pathway_auto_detection(monkeypatch, runner):
    monkeypatch.setattr("cli.commands.pathway.DATA_DIR", test_data_dir)
    result = runner.invoke(load_pathway)
    assert result.exit_code == 0
    assert  f"hsa{PATHWAY_ID}_nodes.tsv" in result.output

def test_load_pathway_specific(monkeypatch, runner):
    monkeypatch.setattr("cli.commands.pathway.DATA_DIR", test_data_dir)
    result = runner.invoke(load_pathway, ["--pathways",  f"hsa{PATHWAY_ID}"])
    assert result.exit_code == 0
    assert f"Loading hsa{PATHWAY_ID}" in result.output

def test_load_pathway_with_explicit_files(monkeypatch, runner):
    monkeypatch.setattr("cli.commands.pathway.DATA_DIR", test_data_dir)
    result = runner.invoke(
        load_pathway,
        ["--pathways",  f"hsa{PATHWAY_ID}",
         "--nodes", str(test_data_dir /  f"hsa{PATHWAY_ID}_nodes.tsv"),
         "--relations", str(test_data_dir /  f"hsa{PATHWAY_ID}_relations.tsv"),
         "--metadatas", str(test_data_dir /  f"hsa_metadata.tsv")]
    )
    assert result.exit_code == 0
    assert f"Loading hsa{PATHWAY_ID}" in result.output

def test_missing_files(monkeypatch, runner):
    monkeypatch.setattr("cli.commands.pathway.DATA_DIR", test_data_dir)
    result = runner.invoke(
        load_pathway,
        ["--pathways",  f"hsa{PATHWAY_ID}", "--nodes", "nonexistent.tsv"]
    )
    assert result.exit_code == 0
    assert "You must specify --nodes, --relations y --metadatas" in result.output

def teardown_module(module):
    shutil.rmtree(test_data_dir.parent.parent, ignore_errors=True)