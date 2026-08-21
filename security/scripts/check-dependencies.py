#!/usr/bin/env python3
"""
TrueStyle Dependency Scanner
Runs npm audit and reports results.
Does not modify dependencies or access external services beyond npm registry.
"""

import subprocess
import sys
import os

def run_dependency_scan():
    print("=" * 50)
    print("TRUESTYLE DEPENDENCY SCAN")
    print("=" * 50)
    
    # Frontend npm audit
    print("\n--- Frontend (root package.json) ---")
    try:
        result = subprocess.run(
            ["npm", "audit", "--audit-level=moderate"],
            capture_output=True, text=True, cwd="."
        )
        print(result.stdout)
        if result.returncode != 0:
            print(f"npm audit found vulnerabilities (exit code {result.returncode})")
            if result.stderr:
                print(result.stderr)
    except FileNotFoundError:
        print("npm: NOT AVAILABLE")
    
    # Backend npm audit
    if os.path.exists("server/package-lock.json"):
        print("\n--- Backend (server/) ---")
        try:
            result = subprocess.run(
                ["npm", "audit", "--audit-level=moderate"],
                capture_output=True, text=True, cwd="server"
            )
            print(result.stdout)
        except FileNotFoundError:
            print("npm: NOT AVAILABLE")
    
    print("=" * 50)
    print("SCAN COMPLETE")
    print("=" * 50)

if __name__ == "__main__":
    run_dependency_scan()
