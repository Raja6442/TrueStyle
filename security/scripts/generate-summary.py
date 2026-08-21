#!/usr/bin/env python3
"""
TrueStyle Report Summary Generator
Reads existing report files and produces a consolidated summary.
Does not access external services or modify application code.
"""

import os

REPORTS_DIR = "Vulnerability Test Results"

def generate_summary():
    print("=" * 50)
    print("TRUESTYLE REPORT SUMMARY")
    print("=" * 50)
    
    if not os.path.exists(REPORTS_DIR):
        print(f"Reports directory '{REPORTS_DIR}' not found.")
        return
    
    files = os.listdir(REPORTS_DIR)
    print(f"\nReports found: {len(files)}")
    for f in sorted(files):
        path = os.path.join(REPORTS_DIR, f)
        size = os.path.getsize(path)
        print(f"  {f} ({size} bytes)")
    
    # Read executive summary if available
    exec_summary = os.path.join(REPORTS_DIR, "executive-summary.md")
    if os.path.exists(exec_summary):
        print(f"\n--- Executive Summary ---")
        with open(exec_summary, "r") as f:
            print(f.read())
    
    print("=" * 50)
    print("SUMMARY COMPLETE")
    print("=" * 50)

if __name__ == "__main__":
    generate_summary()
