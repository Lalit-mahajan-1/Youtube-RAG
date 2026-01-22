import React, { useContext } from "react";
import { useParams } from "react-router";
import { AuthContext } from "./User/AuthContext";
import VideoUpload from "./Page/VideoUpload";

const Home = () => {
  const { User } = useContext(AuthContext);

  if (!User) {
    return <div>Loading user...</div>;
  }

  return (
    <div>
      <div>Email: {User.email}</div>
      <div>Name: {User.name}</div>
      <div>User ID (context): {User.id}</div>

      <br />
      <br />

      <VideoUpload prop={User.id} />
    </div>
  );
};

export default Home;
