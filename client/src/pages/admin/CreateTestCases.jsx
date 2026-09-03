import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ManageTestCases from "./ManageTestCases";

const CreateTestCase = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/admin/problems/${problemId}/testcases`, { replace: true });
  }, [problemId, navigate]);

  return <ManageTestCases />;
};

export default CreateTestCase;
