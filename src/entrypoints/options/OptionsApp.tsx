import { Router, Route } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import Layout from './components/layouts/Layout';
import General from './components/pages/General';
import Platform from './components/pages/Platform';
import Prompts from './components/pages/Prompts';

export default function OptionsApp() {
  return (
    <Router hook={useHashLocation}>
      <Layout>
        <Route path="/general" component={General} />
        <Route path="/platform" component={Platform} />
        <Route path="/prompts" component={Prompts} />
      </Layout>
    </Router>
  );
}
