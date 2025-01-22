// Load table
fetch('/html/gputable.html')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load table.');
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('table-container').innerHTML = data;

        addCopyButtons();
    })
    .catch(error => {
        console.error('Error loading table:', error);
    });

let sortDirection = {}; // Track sort direction for each column

function preprocessNumericColumns() {
    const rows = document.querySelectorAll('#gpuTable tbody tr');

    rows.forEach(row => {
        const GFXScoreCell = row.cells[3];

        // Store original text in a data attribute for filtering
        if (GFXScoreCell) {
            GFXScoreCell.dataset.original = GFXScoreCell.textContent.trim();
            GFXScoreCell.textContent = parseFloat(GFXScoreCell.textContent.trim().replace(/,/g, '')) || '';
        }
    });
}

function applyFilters() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const gpuCheckboxes = document.querySelectorAll('[name="gpu-manufacturer"]:checked');
    const selectedGPUs = Array.from(gpuCheckboxes).map(cb => cb.value);

    const rows = document.querySelectorAll('#gpuTable tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const gpuFullText = cells[2]?.textContent.trim() || 'Unknown';
        const gpuManufacturer = gpuFullText.split(/[-\s]/)[0];

        // Check filters
        const matchesGPU = selectedGPUs.includes(gpuManufacturer);

        // Check search input
        let matchesSearch = false;
        for (let j = 0; j < cells.length; j++) {
            if (![0, 3].includes(j) && cells[j].textContent.toLowerCase().includes(searchValue)) {
                matchesSearch = true;
                break;
            }
        }

        // Display the row if it matches all filters
        row.style.display = matchesSearch && matchesGPU ? '' : 'none';
    });
}

function clearFilters() {
    // Set all checkboxes to checked
    document.querySelectorAll('[name="gpu-manufacturer"]').forEach(checkbox => {
        checkbox.checked = true;
    });

    document.getElementById('searchInput').value = '';

    // Reapply filters to show all rows
    applyFilters();
}

function sortTable(columnIndex) {
    if (columnIndex === 0) return; // Skip sorting for the 'No' column

    const table = document.getElementById("gpuTable");
    const rows = Array.from(table.rows).slice(1);
    const isNumeric = columnIndex === 3; // Check if column is numeric
    const currentDirection = sortDirection[columnIndex] || 'asc'; // Default to 'asc'
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    sortDirection[columnIndex] = newDirection;

    resetSortIndicators();
    const header = table.querySelectorAll("th")[columnIndex];
    header.classList.add(newDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');

    const sortedRows = rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();

        if (isNumeric) {
            const aNumber = parseFloat(aText) || 0; // Convert to number or default to 0
            const bNumber = parseFloat(bText) || 0;
            return newDirection === 'asc' ? aNumber - bNumber : bNumber - aNumber;
        } else {
            return newDirection === 'asc'
                ? aText.localeCompare(bText)
                : bText.localeCompare(aText);
        }
    });

    const tbody = table.tBodies[0];
    sortedRows.forEach(row => tbody.appendChild(row));

    // Reapply filters and search after sorting
    applyFilters();
}

function resetSortIndicators() {
    const headers = document.querySelectorAll("#gpuTable th");
    headers.forEach(header => header.classList.remove("sorted-asc", "sorted-desc"));
}

function downloadCSV() {
    const rows = document.querySelectorAll('#gpuTable tbody tr');
    let csvContent = "No,Manufacturer,GPU Name,GFXBench Score\n";

    rows.forEach(row => {
        if (row.style.display !== 'none') {
            const columns = Array.from(row.cells).map(cell => cell.textContent.trim());
            csvContent += columns.join(",") + "\n";
        }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "filtered_gpu_table.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
    preprocessNumericColumns(); 
    applyFilters(); 
    document.querySelectorAll('[name="gpu-manufacturer"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    document.getElementById('searchInput').addEventListener('input', applyFilters);
});

// Copy button
function addCopyButtons() {
    const table = document.getElementById('gpuTable');
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const cells = Array.from(row.cells).slice(1);

        cells.forEach(cell => {
            const copyButton = document.createElement('button');
            copyButton.classList.add('copy-btn');

            const copyIcon = document.createElement('img');
            copyIcon.src = '/images/copy-icon_.webp'; // Specify the path to the image
            copyIcon.alt = 'Copy';
            copyIcon.classList.add('copy-icon');

            copyButton.appendChild(copyIcon);

            copyButton.addEventListener('click', () => {
                const textToCopy = cell.textContent.trim();
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showCopyPopup(); 
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });

            cell.appendChild(copyButton);
        });
    });
}

// Copy Popup
function showCopyPopup() {
    const popup = document.getElementById('copyPopup');
    popup.style.display = 'block'; 
    setTimeout(() => {
        popup.style.display = 'none';
    }, 1000);
}

// Search field
document.getElementById('searchInput').addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    const table = document.getElementById('gpuTable');
    const rows = table.getElementsByTagName('tr');

    const excludedColumns = [0, 3]; // Skip some columns

    for (let i = 1; i < rows.length; i++) { 
        const cells = rows[i].getElementsByTagName('td');
        let found = false;

        for (let j = 0; j < cells.length; j++) {
            if (!excludedColumns.includes(j) && cells[j].textContent.toLowerCase().includes(filter)) {
                found = true;
                break;
            }
        }

        rows[i].style.display = found ? '' : 'none';
    }
});
