import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { TitleLevel } from '../enums/title.enum';

export interface TitleCriteria {
  level: TitleLevel;
  minExperienceYears: number;
  minEducationLevel: string;
  requiredPublications?: number;
  requiredTrainings?: string[];
  additionalRequirements?: Record<string, any>;
}

export interface EvaluationResult {
  meetsCriteria: boolean;
  score: number;
  breakdown: Record<string, any>;
  recommendations?: string[];
}

@Injectable()
export class TitleEvaluationService {
  private readonly criteriaMap: Map<TitleLevel, TitleCriteria> = new Map();

  constructor() {
    this.initializeDefaultCriteria();
  }

  private initializeDefaultCriteria(): void {
    // تقني زراعي مساعد
    this.criteriaMap.set(TitleLevel.TECHNICIAN_ASSISTANT, {
      level: TitleLevel.TECHNICIAN_ASSISTANT,
      minExperienceYears: 1,
      minEducationLevel: 'DIPLOMA',
      requiredPublications: 0,
    });

    // تقني زراعي
    this.criteriaMap.set(TitleLevel.TECHNICIAN, {
      level: TitleLevel.TECHNICIAN,
      minExperienceYears: 3,
      minEducationLevel: 'BACHELOR',
      requiredPublications: 0,
      requiredTrainings: ['BASIC_SAFETY', 'AGRICULTURAL_PRACTICES'],
    });

    // مهندس زراعي مساعد
    this.criteriaMap.set(TitleLevel.ASSISTANT_ENGINEER, {
      level: TitleLevel.ASSISTANT_ENGINEER,
      minExperienceYears: 5,
      minEducationLevel: 'BACHELOR',
      requiredPublications: 1,
      requiredTrainings: ['PROJECT_MANAGEMENT', 'TECHNICAL_REPORTING'],
    });

    // مهندس زراعي
    this.criteriaMap.set(TitleLevel.ENGINEER, {
      level: TitleLevel.ENGINEER,
      minExperienceYears: 8,
      minEducationLevel: 'BACHELOR',
      requiredPublications: 3,
      requiredTrainings: ['ADVANCED_MANAGEMENT', 'RESEARCH_METHODOLOGY'],
    });

    // مهندس زراعي أول
    this.criteriaMap.set(TitleLevel.SENIOR_ENGINEER, {
      level: TitleLevel.SENIOR_ENGINEER,
      minExperienceYears: 12,
      minEducationLevel: 'MASTER',
      requiredPublications: 5,
      additionalRequirements: {
        leadershipExperience: true,
        majorProjects: 2,
      },
    });

    // مهندس زراعي استشاري
    this.criteriaMap.set(TitleLevel.CONSULTANT_ENGINEER, {
      level: TitleLevel.CONSULTANT_ENGINEER,
      minExperienceYears: 15,
      minEducationLevel: 'PHD',
      requiredPublications: 10,
      additionalRequirements: {
        nationalRecognition: true,
        internationalExperience: true,
      },
    });
  }

  async evaluateUser(
    user: User,
    targetLevel: TitleLevel,
  ): Promise<EvaluationResult> {
    const criteria = this.criteriaMap.get(targetLevel);

    if (!criteria) {
      throw new Error(`Criteria not found for level: ${targetLevel}`);
    }

    const breakdown: Record<string, any> = {};
    let totalScore = 0;
    let maxScore = 0;
    const recommendations: string[] = [];

    // تقييم الخبرة
    const experienceResult = this.evaluateExperience(
      user,
      criteria.minExperienceYears,
    );
    breakdown.experience = experienceResult;
    totalScore += experienceResult.score;
    maxScore += 10;

    // تقييم المؤهل العلمي
    const educationResult = this.evaluateEducation(
      user,
      criteria.minEducationLevel,
    );
    breakdown.education = educationResult;
    totalScore += educationResult.score;
    maxScore += 10;

    // تقييم المنشورات
    const publicationsResult = this.evaluatePublications(
      user,
      criteria.requiredPublications || 0,
    );
    breakdown.publications = publicationsResult;
    totalScore += publicationsResult.score;
    maxScore += 10;

    // تقييم الدورات التدريبية
    if (criteria.requiredTrainings) {
      const trainingsResult = await this.evaluateTrainings(
        user,
        criteria.requiredTrainings,
      );
      breakdown.trainings = trainingsResult;
      totalScore += trainingsResult.score;
      maxScore += 10;
    }

    // تقييم المتطلبات الإضافية
    if (criteria.additionalRequirements) {
      const additionalResult = this.evaluateAdditionalRequirements(
        user,
        criteria.additionalRequirements,
      );
      breakdown.additional = additionalResult;
      totalScore += additionalResult.score;
      maxScore += Object.keys(criteria.additionalRequirements).length * 5;
    }

    const finalScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const meetsCriteria = finalScore >= 70; // 70% كحد أدنى

    if (!meetsCriteria) {
      this.generateRecommendations(breakdown, recommendations);
    }

    return {
      meetsCriteria,
      score: parseFloat(finalScore.toFixed(2)),
      breakdown,
      recommendations,
    };
  }

  private evaluateExperience(user: User, minYears: number): any {
    const actualYears = user.totalExperienceYears || 0;
    const passed = actualYears >= minYears;

    let score = 0;
    if (passed) {
      score = 10;
    } else if (actualYears >= minYears * 0.7) {
      score = 7;
    } else if (actualYears >= minYears * 0.5) {
      score = 5;
    }

    return {
      value: actualYears,
      required: minYears,
      passed,
      score,
      message: passed
        ? `Meets experience requirement (${actualYears} ≥ ${minYears} years)`
        : `Needs ${minYears - actualYears} more years of experience`,
    };
  }

  private evaluateEducation(user: User, minLevel: string): any {
    const educationLevels = ['DIPLOMA', 'BACHELOR', 'MASTER', 'PHD'];
    const userMaxLevel = this.getUserMaxEducationLevel(user);

    const userLevelIndex = educationLevels.indexOf(userMaxLevel);
    const requiredLevelIndex = educationLevels.indexOf(minLevel);

    const passed = userLevelIndex >= requiredLevelIndex;

    let score = 0;
    if (passed) {
      score = 10;
    } else if (userLevelIndex >= requiredLevelIndex - 1) {
      score = 7;
    }

    return {
      value: userMaxLevel,
      required: minLevel,
      passed,
      score,
      message: passed
        ? `Meets education requirement (${userMaxLevel} ≥ ${minLevel})`
        : `Requires higher education level (current: ${userMaxLevel}, required: ${minLevel})`,
    };
  }

  private getUserMaxEducationLevel(user: User): string {
    if (!user.qualifications || user.qualifications.length === 0) {
      return 'DIPLOMA';
    }

    const levels = user.qualifications
      .filter((q) => q.verified)
      .map((q) => q.educationLevel);

    const educationOrder = ['PHD', 'MASTER', 'BACHELOR', 'DIPLOMA'];

    for (const level of educationOrder) {
      if (levels.includes(level)) {
        return level;
      }
    }

    return 'DIPLOMA';
  }

  private evaluatePublications(user: User, requiredCount: number): any {
    const actualCount =
      user.publications?.filter((p) => p.verified)?.length || 0;
    const passed = actualCount >= requiredCount;

    let score = 0;
    if (passed) {
      score = 10;
    } else if (actualCount >= requiredCount * 0.5) {
      score = 5;
    }

    return {
      value: actualCount,
      required: requiredCount,
      passed,
      score,
      message: passed
        ? `Meets publication requirement (${actualCount} ≥ ${requiredCount})`
        : `Needs ${requiredCount - actualCount} more publications`,
    };
  }

  private async evaluateTrainings(
    user: User,
    requiredTrainings: string[],
  ): Promise<any> {
    // This would query a trainings service or database
    const userTrainings = []; // Mock data - in reality, query from database

    const missingTrainings = requiredTrainings.filter(
      (training) => !userTrainings.includes(training),
    );

    const passed = missingTrainings.length === 0;
    const score = passed ? 10 : Math.max(0, 10 - missingTrainings.length * 2);

    return {
      required: requiredTrainings,
      completed: userTrainings,
      missing: missingTrainings,
      passed,
      score,
      message: passed
        ? 'All required trainings completed'
        : `Missing trainings: ${missingTrainings.join(', ')}`,
    };
  }

  private evaluateAdditionalRequirements(
    user: User,
    requirements: Record<string, any>,
  ): any {
    const results: Record<string, any> = {};
    let totalScore = 0;
    let passedCount = 0;

    for (const [key, value] of Object.entries(requirements)) {
      // Implement specific checks for each requirement
      const result = this.checkRequirement(user, key, value);
      results[key] = result;

      if (result.passed) {
        totalScore += 5;
        passedCount++;
      }
    }

    return {
      requirements,
      results,
      passed: passedCount === Object.keys(requirements).length,
      score: totalScore,
    };
  }

  private checkRequirement(
    user: User,
    requirement: string,
    expectedValue: any,
  ): any {
    // Implement specific requirement checks
    switch (requirement) {
      case 'leadershipExperience':
        const hasLeadership = user.experiences?.some(
          (exp) =>
            exp.position.toLowerCase().includes('manager') ||
            exp.position.toLowerCase().includes('head') ||
            exp.position.toLowerCase().includes('director'),
        );
        return {
          passed: hasLeadership === expectedValue,
          value: hasLeadership,
          expected: expectedValue,
        };

      case 'majorProjects':
        // Implementation for major projects check
        return { passed: true, value: 0, expected: expectedValue };

      default:
        return { passed: false, value: null, expected: expectedValue };
    }
  }

  private generateRecommendations(
    breakdown: Record<string, any>,
    recommendations: string[],
  ): void {
    if (!breakdown.experience.passed) {
      recommendations.push(
        `Gain ${breakdown.experience.required - breakdown.experience.value} more years of experience`,
      );
    }

    if (!breakdown.education.passed) {
      recommendations.push(
        `Pursue higher education to reach ${breakdown.education.required} level`,
      );
    }

    if (!breakdown.publications?.passed) {
      recommendations.push(
        `Publish ${breakdown.publications.required - breakdown.publications.value} more papers`,
      );
    }

    if (breakdown.trainings?.missing?.length > 0) {
      recommendations.push(
        `Complete required trainings: ${breakdown.trainings.missing.join(', ')}`,
      );
    }
  }

  addCriteria(level: TitleLevel, criteria: TitleCriteria): void {
    this.criteriaMap.set(level, criteria);
  }

  getCriteria(level: TitleLevel): TitleCriteria | undefined {
    return this.criteriaMap.get(level);
  }

  getAllCriteria(): Map<TitleLevel, TitleCriteria> {
    return new Map(this.criteriaMap);
  }
}
