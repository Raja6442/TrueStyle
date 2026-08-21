#!/usr/bin/env python3
"""
TrueStyle Stack Detection Script
Detects the technology stack by inspecting project files.
Does not modify any files or access external services.
"""

import os
import json
import sys

def detect_stack():
    results = {}
    
    # Check for package.json (Node.js / Frontend)
    if os.path.exists("package.json"):
        with open("package.json", "r") as f:
            try:
                pkg = json.load(f)
                deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
                
                if "react" in deps: results["React"] = deps["react"]
                if "vite" in deps: results["Vite"] = deps["vite"]
                if "tailwindcss" in deps: results["Tailwind CSS"] = deps["tailwindcss"]
                if "typescript" in deps: results["TypeScript"] = deps["typescript"]
                if "@supabase/supabase-js" in deps: results["Supabase JS"] = deps["@supabase/supabase-js"]
                if "firebase" in deps: results["Firebase"] = deps["firebase"]
                if "@tensorflow/tfjs" in deps: results["TensorFlow.js"] = deps["@tensorflow/tfjs"]
                if "tesseract.js" in deps: results["Tesseract.js"] = deps["tesseract.js"]
                if "@emailjs/browser" in deps: results["EmailJS"] = deps["@emailjs/browser"]
            except json.JSONDecodeError:
                print("WARNING: Could not parse package.json")
    
    # Check for backend server
    if os.path.exists("server/index.js"):
        results["Backend"] = "Node.js + Express (server/index.js)"
    
    # Check for Supabase schema
    if os.path.exists("supabase_schema.sql"):
        results["Database"] = "Supabase PostgreSQL"
    
    # Check for Firebase rules
    if os.path.exists("firestore.rules"):
        results["Firestore"] = "Firebase Firestore"
    if os.path.exists("storage.rules"):
        results["Storage"] = "Firebase Storage"
    
    # Check for deployment config
    if os.path.exists("netlify.toml"):
        results["Deployment"] = "Netlify"
    
    # Print results
    print("=" * 50)
    print("TRUESTYLE STACK DETECTION")
    print("=" * 50)
    for tech, version in results.items():
        print(f"  {tech}: {version}")
    print("=" * 50)
    
    return results

if __name__ == "__main__":
    detect_stack()
