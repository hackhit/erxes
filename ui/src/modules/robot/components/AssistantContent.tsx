import { IUser } from 'modules/auth/types';
import React from 'react';
import RTG from 'react-transition-group';
import { IFeature, IRoleValue } from '../types';
import { getCurrentUserName } from '../utils';
import Onboarding from './onboard/Onboarding';
import Setup from './onboard/Setup';
import SetupDetail from './onboard/SetupDetail';
import { Content } from './styles';
import Suggestion from './Suggestion';
import Todo from './Todo';

type Props = {
  availableFeatures: IFeature[];
  currentRoute?: string;
  changeRoute: (route: string) => void;
  forceComplete: () => void;
  currentUser: IUser;
  showContent: boolean;
  toggleContent: (isShow: boolean) => void;
  savedFeatures?: string | null;
};

type State = {
  welcomeStep: number;
  roleValue: IRoleValue;
};

class AssistantContent extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = { welcomeStep: 0, roleValue: {} as IRoleValue };
  }

  restartOnboard = () => {
    this.setState({ welcomeStep: 1 });
    this.props.changeRoute('initial');
  };

  renderContent() {
    const {
      currentRoute,
      changeRoute,
      currentUser,
      forceComplete,
      savedFeatures,
      toggleContent
    } = this.props;

    const commonProps = {
      forceComplete,
      toggleContent,
      currentUserName: getCurrentUserName(currentUser)
    };

    const onClick = () => {
      changeRoute('todoList');
    };

    const getRoleOptions = (roleValue: IRoleValue) => {
      this.setState({ roleValue });
    };

    const onBoarding = (
      <Onboarding
        getRoleOptions={getRoleOptions}
        currentUserName={getCurrentUserName(currentUser)}
        changeRoute={changeRoute}
        activeStep={this.state.welcomeStep}
      />
    );

    if (currentRoute === 'initial') {
      return onBoarding;
    }

    if (currentRoute === 'inComplete') {
      if (!savedFeatures) {
        return onBoarding;
      }

      return <Suggestion {...commonProps} onResumeClick={onClick} />;
    }

    if (currentRoute === 'todoList' || currentRoute === 'todoDetail') {
      return <Todo {...this.props} restartOnboard={this.restartOnboard} />;
    }

    if (currentRoute === 'setupList') {
      return <Setup {...this.props} roleValue={this.state.roleValue} />;
    }

    if (currentRoute === 'setupDetail') {
      return <SetupDetail {...this.props} />;
    }

    return null;
  }

  render() {
    const { showContent } = this.props;

    return (
      <RTG.CSSTransition
        in={showContent}
        appear={true}
        timeout={600}
        classNames="slide-in-small"
        unmountOnExit={true}
      >
        <Content>{this.renderContent()}</Content>
      </RTG.CSSTransition>
    );
  }
}

export default AssistantContent;
