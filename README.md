## Hi there 👋

**CPURanker** is a Database of mobile CPUs, where you can easily find:
- CPU names + Model numbers
- GPU details
- Filter by CPU and GPU manufacturers
- Custom filters as Search Field
- Export your filtered data to a CSV file

Live page is hosted there https://cpuranker.github.io

## Why and who is this for?
- If you've ever tried managing devices in Google Play Console, you know it's not the most convenient tool.

## What’s wrong with it?
- You can’t upload a prepared file with the list of required devices or filters.
- Searching for specific CPUs can be a mess:
- Some CPUs are searchable by Product Name (e.g., Snapdragon 810)
- Others can only be found using their Model Number (e.g., SM8450 for Snapdragon 8 Gen 1)

This results in a long quest to find and filter the CPUs or GPUs you need.
It gets even harder if your game isn’t fully optimized yet, but you need to run early tests. In this case, you may want to identify processors based on their performance metrics or other criteria.

## The solution:
What started as a Google Sheet has now evolved into a simple HTML/JS page where you can:
- Search for mobile CPUs
- Filter and sort based on CPU/GPU Manufacturer, Rank or Antutu Score
- Custom Filters as Search field
- Download your results in CSV format for further use

## Known issues:
- Some Model Numbers are marked as "Unknown." But this isn’t a big problem because those processors can still be found by their names in Google Play Console.

## Future plans:
- Add a tab for GPU rankings (since device selection can also depend on GPU performance)
- Add new download formats
- Add filters for Rank and Antutu Score columns
- Add additional benchmarks for better comparisons
- Automate the process of fetching new CPUs and GPUs to keep the database up-to-date
