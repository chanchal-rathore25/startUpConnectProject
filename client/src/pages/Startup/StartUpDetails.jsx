import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStartupById, fetchStartups } from "../../api/api.js";
import StartUpConnect from "../Startup/StartUpConnect.jsx";
import Hero from "./Hero.jsx";
import RevealSection from "../Home/Reveal.jsx";
import JobCard from "../Startup/JobCard.jsx";
import ActionBar from "../Home/ActionBar.jsx";
import "../../styles/StartUpDetails.css";

const StartUpDetails = () => {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        let data;
        if (id) {
          data = await fetchStartupById(id);
        } else {
          // No id in URL (e.g. "/") -> demo: load first seeded startup
          const list = await fetchStartups();
          data = list?.[0];
        }
        if (!data) throw new Error("No startup found. Did you run `npm run seed` in backend?");
        setStartup(data);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Failed to load startup");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="state-screen">
        <div className="spinner" />
        <p>Loading startup profile…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-screen">
        <p className="error-text">⚠ {error}</p>
      </div>
    );
  }

  return (
    <div>
      <Hero startup={startup} />

      <RevealSection index="01" title="About Startup">
        <p className="about-text">{startup.description}</p>
      </RevealSection>

      <RevealSection index="02" title="Tech Stack">
        <div className="stack-row">
          {startup.techStack.map((tech, i) => (
            <div className="stack-pill" key={tech} style={{ animationDelay: `${0.1 * i}s` }}>
              <span className="dot" /> {tech}
            </div>
          ))}
        </div>
      </RevealSection>

      <RevealSection index="03" title="Open Positions">
       {startup.jobs?.length > 0 ? (
  <div className="job-list">
    {startup.jobs?.map((job) => (
      <JobCard
        job={job}
        key={job._id || job.title}
      />
    ))}
  </div>
) : (
  <p className="text-gray-500">
    No open positions available right now.
  </p>
)}

      </RevealSection>

      <RevealSection index="04" title="Founder" noBorder>
        <div className="founder-card">
          <div className="founder-photo">
            {startup.founder?.name
              ?.split(" ")
              .map((w) => w[0])
              .join("")}
          </div>
          <div>
            <div className="founder-name">{startup.founder?.name}</div>
            <div className="founder-role">{startup.founder?.role}</div>
          </div>
        </div>
      </RevealSection>

      <ActionBar startupId={startup._id} />
    </div>
  );
};

export default StartUpDetails;
 

