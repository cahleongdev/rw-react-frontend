import { Helmet } from 'react-helmet';
import SignUpContainer from '@/containers/Auth/SignUp';

const SignUp: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>

      <SignUpContainer />
    </>
  );
};

export default SignUp;
