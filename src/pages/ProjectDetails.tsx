import { useParams } from "react-router-dom";

const ProjectDetails = () => {
    const { projectId } = useParams();

    return (
        <div>
            <h1>Project Details</h1>
            <p>Project ID: {projectId}</p>
        </div>
    );
};

export default ProjectDetails;
