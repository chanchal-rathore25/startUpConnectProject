import { Link } from "react-router-dom";

const JobCard = ({ job }) => (
  <Link to={`/jobs/${job._id || ""}`} className="job-card">
    <div>
      <div className="job-title">{job.title}</div>
      <div className="job-meta">
        {job.type} · {job.location}
      </div>
    </div>
    <div className="job-arrow">→</div>
  </Link>
);

export default JobCard;
