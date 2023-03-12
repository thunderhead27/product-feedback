import GlobalStyles from './../styles/GlobalStyles';
import { Jost } from '@next/font/google';

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost'
});

const App = ({ Component, pageProps }) => (
  <main className={`${jost.variable} font-sans`}>
    <GlobalStyles />
    <Component {...pageProps} />
  </main>
);

export default App;
