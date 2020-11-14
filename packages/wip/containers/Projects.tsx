import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../redux/actions/projects";

const Projects: React.FC<{}> = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { projects } = useSelector((state: any) => state.projects);

  React.useEffect(() => {
    dispatch(fetchProjects());
  }, []);

  return <div>djlkadjfald</div>;
};

export default Projects;
