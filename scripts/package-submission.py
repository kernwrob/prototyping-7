"""Create a source-only submission ZIP. Database credentials stay local."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent.parent
destination = root / 'output' / 'movie-watchlist-ue6.zip'
destination.parent.mkdir(exist_ok=True)
folders = ['src', 'static', 'scripts', 'tests', 'data', '.vscode']
filenames = ['package.json', 'package-lock.json', 'vite.config.js', 'jsconfig.json',
             '.npmrc', '.gitignore', '.env.example', 'README.md', 'WALKTHROUGH.md']
files = [root / name for name in filenames]
for folder in folders:
    files.extend(path for path in (root / folder).rglob('*') if path.is_file())

with ZipFile(destination, 'w', compression=ZIP_DEFLATED) as archive:
    for path in sorted(files):
        relative = path.relative_to(root)
        if any(part in {'node_modules', '.svelte-kit', '.git', '__pycache__'} for part in relative.parts):
            continue
        if path.name.startswith('.env') and path.name != '.env.example':
            continue
        archive.write(path, Path('movie-watchlist') / relative)

with ZipFile(destination) as archive:
    assert archive.testzip() is None
    assert 'movie-watchlist/.env.example' in archive.namelist()
    assert 'movie-watchlist/.env' not in archive.namelist()
    assert not any('/node_modules/' in name or '/.svelte-kit/' in name for name in archive.namelist())
    print(f'ZIP verified: {destination} ({len(archive.namelist())} files)')
