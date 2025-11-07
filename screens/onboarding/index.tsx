import { Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useOnboardingLogic } from './hooks/useOnboardingLogic';
import { useOnboardingSteps } from './hooks/useOnboardingSteps';
import { OnboardingCarousel } from './components/OnboardingCarousel';
import { LifestyleSelection } from './components/LifestyleSelection';
import { PackageConfirmation } from './components/PackageConfirmation';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const steps = useOnboardingSteps();

  const { state, translateX, panGesture, handlers } = useOnboardingLogic(width, steps.length);

  if (state.showPackageChoice) {
    if (!state.selectedLifestyle) {
      return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <LifestyleSelection onSelectLifestyle={handlers.handleSelectLifestyle} onSkip={handlers.handleSkipPackage} />
        </GestureHandlerRootView>
      );
    }

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PackageConfirmation
          selectedLifestyleId={state.selectedLifestyle}
          onBack={handlers.handleBackFromConfirm}
          onAddPackage={handlers.handleAddPackage}
          onSkipPackage={handlers.handleSkipPackage}
        />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OnboardingCarousel
        steps={steps}
        currentStep={state.currentStep}
        translateX={translateX}
        panGesture={panGesture}
        onNext={handlers.handleNext}
        onSkip={handlers.handleSkip}
      />
    </GestureHandlerRootView>
  );
}
