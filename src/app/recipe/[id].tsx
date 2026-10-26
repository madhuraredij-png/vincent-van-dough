import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ChevronDown, ExternalArrow } from '@/components/icons';
import { BackButton, Body, PrimaryButton, RecipePhoto, Title } from '@/components/ui';
import { getRecipe } from '@/data/api';
import type { Recipe } from '@/data/mock';
import { TITLE_ROW_HEIGHT, useLayout } from '@/lib/layout';
import { colors, fonts } from '@/theme';

// Screen 3: one recipe. Phone stacks everything in one scroll. Tablet puts
// the photo beside the ingredients with the steps below. Desktop puts the
// photo on the left and ingredients plus steps on the right.
export default function RecipeDetails() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const recipe = getRecipe(id);
  const l = useLayout();

  if (!recipe) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Body>We couldn&apos;t find that recipe.</Body>
        <PrimaryButton label="Back to the gallery" onPress={() => router.replace('/')} style={{ marginTop: 16 }} />
      </View>
    );
  }

  const phone = l.bp === 'phone';
  const desktop = l.bp === 'desktop';
  const photoSize = phone ? 200 : desktop ? Math.min(420, (l.width - l.side * 2) * 0.4) : 240;

  const photo = (
    <View style={{ alignItems: 'center', gap: 14 }}>
      <RecipePhoto fill={recipe.fill} style={[styles.photo, { width: photoSize, height: photoSize, borderRadius: phone ? 20 : 24 }]} />
      {!!from && (
        <Text style={styles.from}>
          From the painting: <Text style={{ color: colors.text }}>{from}</Text>
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.titleRow, { marginTop: l.top, marginHorizontal: l.side, minHeight: TITLE_ROW_HEIGHT }]}>
        <View style={styles.backSlot}>
          <BackButton label="Back to recipes" />
        </View>
        <Title size={phone ? 26 : 32} style={{ textAlign: 'center' }}>
          {recipe.name}
        </Title>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: l.side, paddingTop: 18, paddingBottom: l.bottom }}>
        <View style={[styles.content, { maxWidth: desktop ? 1100 : 720 }]}>
          {desktop ? (
            <View style={{ flexDirection: 'row', gap: 56, alignItems: 'flex-start' }}>
              {photo}
              <View style={{ flex: 1, gap: 32 }}>
                <Ingredients recipe={recipe} />
                <Steps recipe={recipe} />
              </View>
            </View>
          ) : l.bp === 'tablet' ? (
            <View style={{ gap: 32 }}>
              <View style={{ flexDirection: 'row', gap: 36, alignItems: 'flex-start' }}>
                {photo}
                <View style={{ flex: 1 }}>
                  <Ingredients recipe={recipe} />
                </View>
              </View>
              <Steps recipe={recipe} />
            </View>
          ) : (
            <View style={{ gap: 28 }}>
              {photo}
              <Ingredients recipe={recipe} />
              <Steps recipe={recipe} />
            </View>
          )}
          <Footer url={recipe.sourceUrl} />
        </View>
      </ScrollView>
    </View>
  );
}

// Ingredients can be folded away; the count stays visible in the header.
function Ingredients({ recipe }: { recipe: Recipe }) {
  const [open, setOpen] = useState(true);
  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`Ingredients, ${recipe.ingredients.length}`}
        onPress={() => setOpen((o) => !o)}
        style={styles.sectionHeader}
      >
        <Title size={22}>Ingredients</Title>
        <View style={styles.headerRight}>
          <Text style={styles.count}>{recipe.ingredients.length}</Text>
          <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
            <ChevronDown />
          </View>
        </View>
      </Pressable>
      {open &&
        recipe.ingredients.map((ing, i) => (
          <View key={ing.name} style={[styles.ingredient, i === 0 && { borderTopWidth: 0 }]}>
            <Text style={styles.ingName}>{ing.name}</Text>
            <Text style={styles.ingAmount}>{ing.amount}</Text>
          </View>
        ))}
    </View>
  );
}

// Numbered steps. Some recipes have no written method, so a link to the
// full recipe takes their place.
function Steps({ recipe }: { recipe: Recipe }) {
  if (recipe.steps.length === 0) {
    return (
      <View style={{ gap: 14 }}>
        <Title size={22}>Method</Title>
        <Body muted>This recipe doesn&apos;t include written steps.</Body>
        <Pressable
          accessibilityRole="link"
          onPress={() => Linking.openURL(recipe.sourceUrl)}
          style={({ pressed }) => [styles.fullRecipe, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.fullRecipeText}>See the full recipe</Text>
          <ExternalArrow />
        </Pressable>
      </View>
    );
  }
  return (
    <View style={{ gap: 16 }}>
      <Title size={22}>Method</Title>
      {recipe.steps.map((step, i) => (
        <View key={i} style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{i + 1}</Text>
          </View>
          <Body style={{ flex: 1 }}>{step}</Body>
        </View>
      ))}
    </View>
  );
}

function Footer({ url }: { url: string }) {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Recipe from TheMealDB ·{' '}
        <Text accessibilityRole="link" onPress={() => Linking.openURL(url)} style={styles.footerLink}>
          View original source
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  titleRow: { justifyContent: 'center', paddingHorizontal: 36 },
  backSlot: { position: 'absolute', left: 0, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 },
  content: { width: '100%', alignSelf: 'center', gap: 32 },
  photo: { boxShadow: '0 14px 30px rgba(0,0,0,0.5)' },
  from: { fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44, marginBottom: 6 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  count: { fontFamily: fonts.medium, fontSize: 14, color: colors.textMuted },
  ingredient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  ingName: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.text },
  ingAmount: { fontFamily: fonts.medium, fontSize: 15, color: colors.textMuted },
  step: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  fullRecipe: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: colors.brown,
  },
  fullRecipeText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  footer: { paddingTop: 20, borderTopWidth: 1, borderColor: colors.border, alignItems: 'center' },
  footerText: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  footerLink: { color: colors.text, textDecorationLine: 'underline' },
});
