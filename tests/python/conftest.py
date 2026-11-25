import importlib.util
import pathlib
import sys

import pytest

ROOT = pathlib.Path(__file__).resolve().parents[2]


@pytest.fixture
def cc():
    """A fresh copy of scripts/compile_content.py for each test (it keeps module-level state)."""
    spec = importlib.util.spec_from_file_location("compile_content", ROOT / "scripts" / "compile_content.py")
    mod = importlib.util.module_from_spec(spec)
    sys.modules["compile_content"] = mod
    spec.loader.exec_module(mod)
    return mod
