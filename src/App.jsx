import "./App.css";

function App() {
  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>Organisation Directory</h1>
          <p>Search and manage organisations.</p>
        </div>

        <button type="button">
          Add organisation
        </button>
      </header>

      <section className="directory-panel">
        <p>Your organisation list will appear here.</p>
      </section>
    </main>
  );
}

export default App;