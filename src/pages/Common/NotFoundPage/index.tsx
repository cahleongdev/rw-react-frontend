import { Helmet } from 'react-helmet';

const NotFound: React.FC = () => {
  return <>
    <Helmet>
      <title>Not Found</title>
    </Helmet>
    <h1>Not Found 404 Error</h1>
  </>
};

export default NotFound;