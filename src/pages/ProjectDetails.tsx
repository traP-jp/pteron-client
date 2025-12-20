import { useParams } from "react-router-dom";

import ErrorBoundary from "/@/components/ErrorBoundary";

const ProjectDetails = () => {
    const { projectId } = useParams();

    return (
        <ErrorBoundary>
            <div>
                <h1>Project Details</h1>
                <p>Project ID: {projectId}</p>
            </div>
        </ErrorBoundary>
    );
};

export default ProjectDetails;
