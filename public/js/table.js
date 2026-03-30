(function () {
  'use strict';

  function parseScore(val) {
    if (!val) return -1;
    var parts = val.split('/');
    if (parts.length === 2) {
      var num = parseFloat(parts[0]);
      var den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den;
    }
    return parseFloat(val) || -1;
  }

  function initTable(tableId) {
    var table = document.getElementById(tableId);
    if (!table) return;

    var tbody = table.querySelector('tbody');
    var allRows = Array.from(tbody.querySelectorAll('tr'));
    var total = allRows.length;
    var countEl = document.getElementById('table-count');
    var searchEl = document.getElementById('table-search');
    var sortBtns = Array.from(table.querySelectorAll('.sort-btn'));
    var colFilters = Array.from(table.querySelectorAll('.col-filter'));

    var currentSort = { col: -1, dir: 'none' };
    var searchQuery = '';
    var activeFilters = {};

    function updateCount(visible) {
      if (countEl) {
        countEl.textContent = 'Showing ' + visible + ' of ' + total + ' sites';
      }
    }

    function isRowVisible(row) {
      var cells = Array.from(row.querySelectorAll('td'));

      // Global search: any cell data-val contains query
      if (searchQuery) {
        var q = searchQuery.toLowerCase();
        var match = cells.some(function (td) {
          return (td.getAttribute('data-val') || '').toLowerCase().indexOf(q) !== -1;
        });
        if (!match) return false;
      }

      // Column filters: exact match on specific col
      var filterCols = Object.keys(activeFilters);
      for (var i = 0; i < filterCols.length; i++) {
        var col = parseInt(filterCols[i], 10);
        var filterVal = activeFilters[filterCols[i]];
        if (filterVal === '') continue;
        var cell = cells[col];
        if (!cell) return false;
        if ((cell.getAttribute('data-val') || '') !== filterVal) return false;
      }

      return true;
    }

    function applyFilters() {
      var visible = 0;
      allRows.forEach(function (row) {
        var show = isRowVisible(row);
        row.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      updateCount(visible);
    }

    function sortRows(col, dir) {
      var SCORE_COL = 3;
      var rows = Array.from(tbody.querySelectorAll('tr'));
      rows.sort(function (a, b) {
        var aVal = (a.querySelectorAll('td')[col] || {}).getAttribute('data-val') || '';
        var bVal = (b.querySelectorAll('td')[col] || {}).getAttribute('data-val') || '';

        var result;
        if (col === SCORE_COL) {
          result = parseScore(aVal) - parseScore(bVal);
        } else {
          result = aVal.localeCompare(bVal, undefined, { sensitivity: 'base' });
        }
        return dir === 'descending' ? -result : result;
      });
      rows.forEach(function (row) { tbody.appendChild(row); });
      // Rebuild allRows reference in sorted order
      allRows.length = 0;
      Array.from(tbody.querySelectorAll('tr')).forEach(function (r) { allRows.push(r); });
    }

    // Sort button clicks
    sortBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var col = parseInt(btn.getAttribute('data-col'), 10);
        var th = btn.closest('th');

        // Toggle direction
        var newDir;
        if (currentSort.col === col && currentSort.dir === 'ascending') {
          newDir = 'descending';
        } else {
          newDir = 'ascending';
        }

        // Clear all aria-sort
        sortBtns.forEach(function (b) {
          b.closest('th').setAttribute('aria-sort', 'none');
        });

        th.setAttribute('aria-sort', newDir);
        currentSort = { col: col, dir: newDir };
        sortRows(col, newDir);
        applyFilters();
      });
    });

    // Global search
    if (searchEl) {
      searchEl.addEventListener('input', function () {
        searchQuery = searchEl.value.trim();
        applyFilters();
      });
    }

    // Column filters
    colFilters.forEach(function (sel) {
      sel.addEventListener('change', function () {
        var col = sel.getAttribute('data-col');
        activeFilters[col] = sel.value;
        applyFilters();
      });
    });

    // Initial count
    updateCount(total);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTable('sites-table');
  });
}());
