import { useEffect, useState } from "react";

interface Weather {
  name: string;
  temp: number;
  description: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function App() {
  const [city, setCity] = useState("New York");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function fetchWeather() {
    try {
      setStatus("loading");
      setError("");

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current_weather=true`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch weather");
      }

      const data = await res.json();

      setWeather({
        name: city,
        temp: data.current_weather.temperature,
        description: `Wind ${data.current_weather.windspeed} km/h`,
      });

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError("Unable to load weather data.");
    }
  }

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>🌤️ Weather Dashboard</h2>

        <div style={styles.row}>
          <input
            style={styles.input}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button style={styles.button} onClick={fetchWeather}>
            Refresh
          </button>
        </div>

        {status === "loading" && <p>Loading weather...</p>}
        {status === "error" && <p style={{ color: "red" }}>{error}</p>}

        {weather && status === "success" && (
          <div style={styles.weatherBox}>
            <h3>{weather.name}</h3>
            <p>🌡️ Temperature: {weather.temp}°C</p>
            <p>{weather.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 20,
  },
  card: {
    width: 360,
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  row: {
    display: "flex",
    gap: 10,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    padding: 8,
  },
  button: {
    padding: "8px 14px",
    borderRadius: 10,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },  
  weatherBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    background: "linear-gradient(135deg, #1f2933, #111827)",
    color: "#f9fafb",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
};
  
  
  