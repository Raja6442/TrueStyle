import pandas as pd
import sys

def create_excel_files():
    try:
        import openpyxl
    except ImportError:
        print("openpyxl not installed, please install to generate .xlsx")
        sys.exit(1)

    import pandas as pd
    
    # 1. findings.xlsx
    with pd.ExcelWriter('Vulnerability Test Results/findings.xlsx', engine='openpyxl') as writer:
        pd.DataFrame(columns=['Finding ID', 'Severity', 'Category', 'CWE', 'Status', 'File', 'Endpoint', 'Description', 'Impact', 'Recommended Fix', 'Verification']).to_excel(writer, sheet_name='Security Findings', index=False)
        pd.DataFrame(columns=['Endpoint', 'HTTP Method', 'Authentication', 'Authorization', 'Role', 'File Path', 'Parameters', 'Response', 'Rate Limiting', 'Notes']).to_excel(writer, sheet_name='Endpoint Inventory', index=False)
        pd.DataFrame(columns=['Package', 'Version', 'Severity', 'CVE', 'Scanner', 'Status', 'Recommendation']).to_excel(writer, sheet_name='Dependency Vulnerabilities', index=False)
        pd.DataFrame(columns=['Severity', 'Count', 'Risk Level', 'Priority']).to_excel(writer, sheet_name='Risk Summary', index=False)

    # 2. endpoint-inventory.xlsx
    with pd.ExcelWriter('Vulnerability Test Results/endpoint-inventory.xlsx', engine='openpyxl') as writer:
        pd.DataFrame(columns=['Finding ID', 'Severity', 'Category', 'CWE', 'Status', 'File', 'Endpoint', 'Description', 'Impact', 'Recommended Fix', 'Verification']).to_excel(writer, sheet_name='Security Findings', index=False)
        
        endpoints = [
            {'Endpoint': 'POST /api/send-otp', 'HTTP Method': 'POST', 'Authentication': '', 'Authorization': '', 'Role': '', 'File Path': 'server/index.js', 'Parameters': '', 'Response': '', 'Rate Limiting': '', 'Notes': ''},
            {'Endpoint': 'POST /api/scrape', 'HTTP Method': 'POST', 'Authentication': '', 'Authorization': '', 'Role': '', 'File Path': 'server/index.js', 'Parameters': '', 'Response': '', 'Rate Limiting': '', 'Notes': ''}
        ]
        pd.DataFrame(endpoints).to_excel(writer, sheet_name='Endpoint Inventory', index=False)
        
        pd.DataFrame(columns=['Package', 'Version', 'Severity', 'CVE', 'Scanner', 'Status', 'Recommendation']).to_excel(writer, sheet_name='Dependency Vulnerabilities', index=False)
        pd.DataFrame(columns=['Severity', 'Count', 'Risk Level', 'Priority']).to_excel(writer, sheet_name='Risk Summary', index=False)

if __name__ == "__main__":
    create_excel_files()
