import { Router, Route, Redirect } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import Layout from './components/layouts/Layout';
import General from './pages/General';
import Platform from './pages/Platform';
import Prompts from './pages/Prompts';

export default function OptionsApp() {
  return (
    <Router hook={useHashLocation}>
      <Layout>
        <Route path="/" component={() => <Redirect to="/general" />} />
        <Route path="/general" component={General} />
        <Route path="/platform" component={Platform} />
        <Route path="/prompts" component={Prompts} />
      </Layout>
    </Router>
  );
}
