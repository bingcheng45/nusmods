import { memo, Fragment, FC } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { flatten, map, mapValues, values } from 'lodash';

import type { ModuleCondensed } from 'types/modules';
import type { State as StoreState } from 'types/state';

import { toggleFeedback } from 'actions/app';
import { toggleBetaTesting } from 'actions/settings';
import { modulePage } from 'views/routes/paths';
import { DollarSign, Zap } from 'react-feather';
import ExternalLink from 'views/components/ExternalLink';
import Title from 'views/components/Title';
import { FeedbackButtons } from 'views/components/FeedbackModal';
import { getModuleCondensed } from 'selectors/moduleBank';
import useScrollToTop from 'views/hooks/useScrollToTop';
import { currentTests } from 'views/settings/BetaToggle';
import { notNull } from 'types/utils';
import config from 'config';

import ReviewIcon from 'img/icons/review.svg';
import WrenchIcon from 'img/icons/wrench.svg';
import ChatIcon from 'img/icons/chat.svg';
import CharityIcon from 'img/icons/charity.svg';
import BugReportIcon from 'img/icons/bug-report.svg';
import DeveloperIcon from 'img/icons/programmer.svg';
import ContributeIcon from 'img/icons/love.svg';
import VenueIcon from 'img/icons/compass.svg';

import UnmappedVenues from '../UnmappedVenues';
import ContributorList from '../ContributorList';
import styles from './ContributeContainer.scss';

type SemesterModules = { [semester: number]: ModuleCondensed[] };

type Props = {
  modules: SemesterModules;
  beta: boolean;

  toggleFeedback: () => void;
  toggleBetaTesting: () => void;
};

const ContributeContainer: FC<Props> = ({ modules, beta, ...props }) => {
  useScrollToTop();
  return (
    <div className={styles.pageContainer}>
      <Title>Contribute</Title>

      <header>
        <ContributeIcon className={styles.topImage} />
        <h1>Help Us Help You!</h1>
      </header>

      <p>
        NUSMods is a 100% student-run, open source project. We rely on the continuous support of our
        contributors and the NUS student community. Many students have reported issues, suggested
        improvements, and even contributed code. Join us to make NUS a better place for its students
        and your friends!
      </p>

      <header>
        <h2>For Everyone</h2>
      </header>

      {flatten(values(modules)).length > 0 && (
        <section>
          <header>
            <ReviewIcon />
            <h3>Write Module Reviews</h3>
          </header>

          <p>
            Help your fellow students make better choices when planning their module by leaving your
            honest opinions on modules you have taken before. Here are all of the modules you have
            taken this year:
          </p>

          <div className={styles.writeReviews}>
            {map(modules, (moduleCondensed, semester) => (
              <Fragment key={semester}>
                <h4>{config.semesterNames[semester]}</h4>
                <div className={styles.reviewWrapper}>
                  {moduleCondensed.map(({ moduleCode, title }) => (
                    <Link
                      key={moduleCode}
                      className={classnames(styles.reviewButton, 'btn btn-outline-primary')}
                      to={`${modulePage(moduleCode, title)}#reviews`}
                      target="_blank"
                    >
                      Review <span className={styles.reviewModuleCode}>{moduleCode}</span> {title}
                    </Link>
                  ))}
                </div>
              </Fragment>
            ))}
          </div>
        </section>
      )}

      <section>
        <header>
          <VenueIcon />
          <h3>Map the School</h3>
        </header>

        <p>
          We are mapping venues found on timetables to help students get around the school. This is
          especially useful for freshmen and exchange students who find NUS hard to navigate.
        </p>

        <UnmappedVenues />
      </section>

      {currentTests.length > 0 && (
        <section>
          <header>
            <WrenchIcon />
            <h3>Test Drive NUSMods Beta</h3>
          </header>

          <p>
            We&apos;re constantly updating NUSMods with new and exciting features, and you can use
            them before everyone else by participating in NUSMods Beta. Help find bugs and provide
            feedback to shape the future of NUSMods. Currently we are testing the following
            features:
          </p>

          <ul>
            {currentTests.map((test, index) => (
              <li key={index}>{test}</li>
            ))}
          </ul>

          {beta ? (
            <>
              <p>You are already in the beta program.</p>
              <p className="text-center">
                <button
                  type="button"
                  className="btn btn-lg btn-outline-primary"
                  onClick={props.toggleFeedback}
                >
                  Give Feedback
                </button>
              </p>
              <p>
                Go to <Link to="/settings#beta">settings</Link> if you wish to stop using NUSMods
                Beta.
              </p>
            </>
          ) : (
            <p className="text-center">
              <button
                type="button"
                className={classnames(styles.betaButton, 'btn btn-lg btn-outline-primary')}
                onClick={props.toggleBetaTesting}
              >
                <Zap />
                Join NUSMods Beta
              </button>
            </p>
          )}
        </section>
      )}

      <section>
        <header>
          <ChatIcon />
          <h3>Give Us Feedback</h3>
        </header>

        <p>
          We are always open to feedback. If you see something that doesn&apos;t seem quite right,
          or have a new idea for making NUSMods better, you can use these links below to reach us.
        </p>

        <FeedbackButtons />
      </section>

      <section>
        <header>
          <CharityIcon />
          <h3>Donate</h3>
        </header>
        <p>
          NUSMods servers are currently graciously paid for by the school, but we still need money
          to promote NUSMods and find contributors to ensure the site is maintained in the long
          term. More contributors will also mean we can work on bringing you new features, such as
          those currently in beta. Your contributions will go towards the cost of promotional
          materials such as T-shirts and stickers. Our expenses are transparent and can be viewed on{' '}
          <ExternalLink href="https://opencollective.com">OpenCollective</ExternalLink>.
        </p>

        <p>These are our current backers:</p>

        <p className={styles.backerAvatars}>
          <ExternalLink href="https://opencollective.com/nusmods#backers">
            <img
              alt="Avatar of our backers"
              src="https://opencollective.com/nusmods/backers.svg?width=610"
            />
          </ExternalLink>
        </p>

        <p className="text-center">
          <ExternalLink
            href="https://opencollective.com/nusmods"
            className={classnames(styles.donateButton, 'btn btn-lg btn-outline-primary')}
          >
            <DollarSign />
            Donate to NUSMods
          </ExternalLink>
        </p>
      </section>

      <header>
        <h2>For Developers & Designers</h2>
      </header>

      <section>
        <header>
          <BugReportIcon />
          <h3>File Bug Reports and Feature Requests</h3>
        </header>

        <p>
          If you have an account on GitHub, you can file bug reports and feature request directly
          using GitHub issues.
        </p>

        <div className={styles.githubLinks}>
          <ExternalLink
            className="btn btn-outline-primary"
            href="https://github.com/nusmodifications/nusmods/issues/new?template=Bug_report.md"
          >
            <h4>Bug Report</h4>
            <p>Create a report to help reproduce and fix the issue</p>
          </ExternalLink>
          <ExternalLink
            className="btn btn-outline-primary"
            href="https://github.com/nusmodifications/nusmods/issues/new?template=Feature_request.md"
          >
            <h4>Feature Request</h4>
            <p>Suggest a new feature or enhancement for the project</p>
          </ExternalLink>
        </div>
      </section>

      <section>
        <header>
          <DeveloperIcon />
          <h3>Contribute Code and Design</h3>
        </header>

        <p>
          You can also help directly contribute code and design. We welcome all contributions, big
          and small. To get your feet wet, we suggest starting with the good first issues suitable
          for first time contributors of various skill levels. We think NUSMods is a good way to
          learn modern web development on a production web application and make a positive impact on
          the lives of NUS students.
        </p>

        <div className={styles.contributeLinks}>
          <ExternalLink
            className="btn btn-outline-primary"
            href="https://github.com/nusmodifications/nusmods/issues?utf8=%E2%9C%93&q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22+-label%3ATaken"
          >
            <h4>Good First Issues</h4>
            <p>Issues with limited scope good for first time contributors</p>
          </ExternalLink>
          <ExternalLink
            className="btn btn-outline-primary"
            href="https://github.com/nusmodifications/nusmods/blob/master/CONTRIBUTING.md"
          >
            <h4>Contribution Guide</h4>
            <p>Information for first time contributors</p>
          </ExternalLink>
          <ExternalLink className="btn btn-outline-primary" href="https://t.me/NUSMods">
            <h4>Telegram Chat</h4>
            <p>Talk to us about NUSMods design and development</p>
          </ExternalLink>
          <ExternalLink
            className="btn btn-outline-primary"
            href="https://groups.google.com/forum/#!forum/nusmods"
          >
            <h4>Mailing List</h4>
            <p>Subscribe to news and updates</p>
          </ExternalLink>
        </div>

        <p>
          Here are our top NUSMods contributors. Previous maintainers have gone on to work at
          Google, Facebook, and other prestigious technology companies. <strong>You</strong> could
          be next!
        </p>

        <ContributorList size={12} />

        <p className="text-right">
          <Link to="/contributors" className="btn btn-outline-primary">
            View all contributors →
          </Link>
        </p>
      </section>

      <p className={styles.attribution}>
        Icon made by <ExternalLink href="https://www.freepik.com/">Freepik</ExternalLink> from{' '}
        <ExternalLink href="https://www.flaticon.com/">www.flaticon.com</ExternalLink>
      </p>
    </div>
  );
};

const ConnectedContributeContainer = connect(
  (state: StoreState) => {
    const getModule = getModuleCondensed(state.moduleBank);
    const modules: SemesterModules = mapValues(
      state.timetables.lessons,
      (timetable): ModuleCondensed[] => Object.keys(timetable).map(getModule).filter(notNull),
    );

    return {
      modules,
      beta: !!state.settings.beta,
    };
  },
  { toggleFeedback, toggleBetaTesting },
)(memo(ContributeContainer));

export default ConnectedContributeContainer;
