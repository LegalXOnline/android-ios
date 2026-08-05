/**
 * HowItWorksStepper — Fixed 4-step visual process stepper.
 *
 * Spec: 07_Module_Documentation.md §3.1 (Section 8)
 * 1. Submit Requirements -> 2. Expert Drafting -> 3. Review -> 4. Final Delivery
 */
import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, FontWeight, Radii, Spacing, Typography } from '@theme';

interface HowItWorksStepperProps {
  steps: { title: string; description: string }[];
}

export function HowItWorksStepper({ steps }: HowItWorksStepperProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>How It Works</Text>
      <View style={styles.stepperCard}>
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          return (
            <View key={`step-${idx}`} style={styles.stepRow}>
              {/* Step indicator column */}
              <View style={styles.indicatorCol}>
                <View style={styles.circle}>
                  <Text style={styles.stepNumber}>{idx + 1}</Text>
                </View>
                {!isLast && <View style={styles.line} />}
              </View>

              {/* Step content column */}
              <View style={styles.contentCol}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.description}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.ink,
  },
  stepperCard: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.card,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  indicatorCol: {
    alignItems: 'center',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: Colors.surfaceAlt,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 28,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  contentCol: {
    flex: 1,
    paddingBottom: Spacing.sm,
    gap: 2,
  },
  stepTitle: {
    ...Typography.body,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
  },
  stepDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
