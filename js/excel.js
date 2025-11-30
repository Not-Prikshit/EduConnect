// Excel Utility using SheetJS (Client-side)

function exportToExcel(data, fileName) {
    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (error) {
        console.error('Error exporting Excel:', error);
        alert('Failed to export Excel.');
    }
}

function importFromExcel(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            callback(json);
        } catch (error) {
            console.error('Error importing Excel:', error);
            alert('Failed to import Excel.');
        }
    };
    reader.readAsArrayBuffer(file);
}
