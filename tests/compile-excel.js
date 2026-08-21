const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { parse } = require('csv-parse/sync');

async function compileMasterExcel() {
    console.log("Starting compilation of Master Excel file...");
    
    // Directory containing the CSVs (same as script directory parent for GitHub actions root, or inside tests)
    // GitHub actions download-artifact usually puts them in the root directory.
    // So we search the root and 'tests' directory for .csv files.
    const rootDir = path.join(__dirname, '..');
    
    const files = fs.readdirSync(rootDir);
    const csvFiles = files.filter(f => f.endsWith('.csv') && f.includes('_test_cases'));

    if (csvFiles.length === 0) {
        console.error("No CSV test cases found! Ensure previous jobs uploaded them correctly.");
        return;
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'TrueStyle CI';
    workbook.created = new Date();

    // Mapping CSV file names to pretty sheet names
    const getSheetName = (filename) => {
        const base = filename.replace('_test_cases.csv', '');
        const words = base.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1));
        let name = words.join(' ');
        if (name.length > 31) name = name.substring(0, 31); // Excel sheet name limit
        return name;
    };

    for (const file of csvFiles) {
        const filePath = path.join(rootDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        console.log(`Processing: ${file}`);
        
        let records = [];
        try {
            records = parse(fileContent, {
                columns: false,
                skip_empty_lines: true
            });
        } catch (err) {
            console.error(`Failed to parse ${file}:`, err.message);
            continue;
        }

        if (records.length === 0) continue;

        const sheetName = getSheetName(file);
        const worksheet = workbook.addWorksheet(sheetName, {
            views: [{ state: 'frozen', ySplit: 1 }]
        });

        // Add Data
        worksheet.addRows(records);

        // Format Header Row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4F81BD' } // Nice blue color
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

        // Auto-fit Columns (estimate width)
        worksheet.columns.forEach((column, colNumber) => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                let cellValue = cell.value ? cell.value.toString() : "";
                if (cellValue.length > maxLength) {
                    maxLength = cellValue.length;
                }
            });
            // Give some padding, but cap at 50 to prevent huge columns
            column.width = Math.min(Math.max(maxLength + 2, 10), 50);
            column.alignment = { vertical: 'top', wrapText: true };
        });
    }

    const outputPath = path.join(rootDir, 'TrueStyle_Master_Test_Cases.xlsx');
    await workbook.xlsx.writeFile(outputPath);
    console.log(`\nSuccess! Master Excel file generated at: ${outputPath}`);
}

compileMasterExcel().catch(console.error);
