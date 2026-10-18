
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getOrganisations } from "./services/organisationService";
import en from "./locales/en.json";
import "./App.css";
import CreateOrganisationForm from "./components/CreateOrganisationForm";

const allowedStatuses = [
  "all",
  "active",
  "inactive",
  "suspended",
  "unknown"
];

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const initialQuery = searchParams.get("q") || "";
  const initialStatus = searchParams.get("status") || "all";

  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [debouncedSearch, setDebouncedSearch] = useState(initialQuery);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState(
    allowedStatuses.includes(initialStatus) ? initialStatus : "all"
  );

  function handleCreateOrganisation(newOrganisation) {
    setOrganisations((current) => [
      newOrganisation,
      ...current
    ]);
  }

  // Load organisations from our simulated API.
  useEffect(() => {
    let cancelled = false;

    async function loadOrganisations() {
      setLoading(true);
      setError(false);

      try {
        const data = await getOrganisations();

        if (!cancelled) {
          setOrganisations(data);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrganisations();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // Debounce search input by 350 milliseconds.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Keep the search and status filter reflected in the URL.
  useEffect(() => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);

        if (debouncedSearch) {
          nextParams.set("q", debouncedSearch);
        } else {
          nextParams.delete("q");
        }

        if (selectedStatus !== "all") {
          nextParams.set("status", selectedStatus);
        } else {
          nextParams.delete("status");
        }

        return nextParams;
      },
      { replace: true }
    );
  }, [debouncedSearch, selectedStatus, setSearchParams]);

  // Support URLs opened directly or browser back/forward navigation.
  useEffect(() => {
    const query = searchParams.get("q") || "";
    const statusFromUrl = searchParams.get("status") || "all";

    setSearchTerm(query);
    setDebouncedSearch(query);

    setSelectedStatus(
      allowedStatuses.includes(statusFromUrl)
        ? statusFromUrl
        : "all"
    );
  }, [searchParams]);

  function handleSort(column) {
    if (sortBy === column) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc"
      );
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  }

  // Apply search and status filtering.

  const filteredOrganisations = useMemo(() => {
    const query = debouncedSearch.toLowerCase();

    const filtered = organisations.filter((org) => {
      const matchesName = org.name.toLowerCase().includes(query);

      const matchesStatus =
        selectedStatus === "all" || org.status === selectedStatus;

      return matchesName && matchesStatus;
    });

    // Sort a copy so the original array is never modified.
    return [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
          numeric: true
        });
      } else if (sortBy === "createdAt") {
        // Keep invalid or missing dates at the bottom.
        if (!a.createdAt && !b.createdAt) return 0;
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;

        comparison =
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime();
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [
    organisations,
    debouncedSearch,
    selectedStatus,
    sortBy,
    sortDirection
  ]);


  if (loading) {
    return (
      <main className="page">
        <h1>{en.app.title}</h1>
        <p role="status">{en.app.loading}</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <h1>{en.app.title}</h1>
        <p role="alert">{en.app.loadError}</p>
        <button onClick={() => setReloadKey((key) => key + 1)}>
          {en.app.retry}
        </button>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>{en.app.title}</h1>
          <p>{en.app.subtitle}</p>
          <p>
            {en.app.total}: {filteredOrganisations.length}
          </p>
        </div>
        <button
          type="button"
          className="create-organisation-button"
          onClick={() => setShowCreateForm(true)}
        >
          {en.form.open}
        </button>
      </header>

      {showCreateForm && (
        <CreateOrganisationForm
          organisations={organisations}
          onCreate={handleCreateOrganisation}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <section className="directory-panel">
        <div className="filters">
          <div className="filter-field">
            <label htmlFor="organisation-search">
              {en.search.label}
            </label>
            <input
              id="organisation-search"
              type="search"
              placeholder={en.search.placeholder}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="filter-field">
            <label htmlFor="status-filter">
              {en.filter.label}
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option value="all">{en.filter.all}</option>
              <option value="active">{en.filter.active}</option>
              <option value="inactive">{en.filter.inactive}</option>
              <option value="suspended">{en.filter.suspended}</option>
              <option value="unknown">{en.filter.unknown}</option>
            </select>
          </div>
        </div>

        {filteredOrganisations.length === 0 ? (
          <p>{en.app.empty}</p>
        ) : (
          <div className="table-container">
            <table>

              <thead>
                <tr>
                  <th
                    aria-sort={
                      sortBy === "name"
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <button
                      type="button"
                      className="sort-button"
                      aria-label={
                        sortDirection === "asc" && sortBy === "name"
                          ? en.table.sortDescending
                          : en.table.sortAscending
                      }
                      onClick={() => handleSort("name")}
                    >
                      {en.table.name}
                      {sortBy === "name" && (
                        <span aria-hidden="true">
                          {sortDirection === "asc" ? " ↑" : " ↓"}
                        </span>
                      )}
                    </button>
                  </th>

                  <th>{en.table.status}</th>
                  <th>{en.table.members}</th>
                  <th>{en.table.owner}</th>

                  <th
                    aria-sort={
                      sortBy === "createdAt"
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <button
                      type="button"
                      className="sort-button"
                      aria-label={
                        sortDirection === "asc" && sortBy === "createdAt"
                          ? en.table.sortDescending
                          : en.table.sortAscending
                      }
                      onClick={() => handleSort("createdAt")}
                    >
                      {en.table.createdAt}
                      {sortBy === "createdAt" && (
                        <span aria-hidden="true">
                          {sortDirection === "asc" ? " ↑" : " ↓"}
                        </span>
                      )}
                    </button>
                  </th>
                </tr>
              </thead>


              <tbody>
                {filteredOrganisations.map((org) => (
                  <tr key={org.rowKey}>
                    <td>{org.name || en.app.unnamed}</td>
                    <td>
                      {en.filter[org.status] || en.filter.unknown}
                    </td>
                    <td>{org.memberCount ?? en.app.noValue}</td>
                    <td>{org.ownerEmail || en.app.noValue}</td>
                    <td>
                      {org.createdAt
                        ? new Date(org.createdAt).toLocaleDateString()
                        : en.app.noValue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
