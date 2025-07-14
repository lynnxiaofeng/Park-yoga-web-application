import { Link } from 'react-router-dom';

const Home = () => (
    <>
      <h2>Welcome to Park Yoga Courses</h2>
      <p>
        Start exploring the available courses here {" "}
        <Link to="/courses">Courses</Link>
      </p>
    </>
  );

export default Home;