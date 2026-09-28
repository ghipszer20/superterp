"use client";

import { useState } from "react";
import type { DietTag, Meal } from "@superterp/campus-data";
import { Chip, Segmented } from "@/components/Segmented";
import { ExternalIcon } from "@/components/icons";
import { Card, EmptyState, Section } from "@/components/ui";
import { currentMealName, FILLER } from "@/lib/status";
import styles from "./dining.module.css";

type Hall = { id: number; name: string; meals: Meal[] | null };

const DIETS: { tag: DietTag; label: string }[] = [
  { tag: "vegetarian", label: "Vegetarian" },
  { tag: "vegan", label: "Vegan" },
  { tag: "halal", label: "Halal-friendly" },
];

// Allergen flags as nutrition.umd.edu labels them ("Contains …").
const ALLERGENS = ["dairy", "gluten", "egg", "soy", "nuts", "sesame", "fish", "shellfish", "pork"];

export function DiningView({ halls, initialMinutes }: { halls: Hall[]; initialMinutes: number }) {
  const [hallId, setHallId] = useState(halls[0]!.id);
  const [mealName, setMealName] = useState<string>(currentMealName(initialMinutes));
  const [diets, setDiets] = useState<DietTag[]>([]);
  const [avoid, setAvoid] = useState<string[]>([]);

  const hall = halls.find((h) => h.id === hallId)!;
  const meal = hall.meals?.find((m) => m.name === mealName) ?? hall.meals?.[0];

  const stations = (meal?.stations ?? [])
    .map((s) => ({
      ...s,
      items: s.items.filter(
        (i) => diets.every((d) => i.diets.includes(d)) && avoid.every((a) => !i.contains.includes(a)),
      ),
    }))
    .filter((s) => s.items.length > 0)
    // Main stations first; sides, salad bar and desserts after (stable sort keeps UMD's order otherwise).
    .sort((a, b) => Number(FILLER.test(a.name)) - Number(FILLER.test(b.name)));

  const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  return (
    <>
      <div className={styles.controls}>
        <Segmented
          label="Dining hall"
          options={halls.map((h) => ({ value: h.id, label: h.name }))}
          value={hallId}
          onChange={setHallId}
        />
        {hall.meals && hall.meals.length > 0 ? (
          <Segmented
            label="Meal"
            options={hall.meals.map((m) => ({ value: m.name, label: m.name }))}
            value={meal?.name ?? ""}
            onChange={setMealName}
          />
        ) : null}
        <div className={styles.chips} aria-label="Diet">
          {DIETS.map((d) => (
            <Chip key={d.tag} pressed={diets.includes(d.tag)} onClick={() => setDiets(toggle(diets, d.tag))}>
              {d.label}
            </Chip>
          ))}
        </div>
        <details className={styles.avoid}>
          <summary>
            Avoid allergens{avoid.length ? ` · ${avoid.length}` : ""}
          </summary>
          <div className={styles.chips}>
            {ALLERGENS.map((a) => (
              <Chip key={a} pressed={avoid.includes(a)} onClick={() => setAvoid(toggle(avoid, a))}>
                {`No ${a}`}
              </Chip>
            ))}
          </div>
        </details>
      </div>

      {hall.meals === null ? (
        <Card>
          <EmptyState title={`Couldn’t load ${hall.name}`}>UMD Dining didn&apos;t respond. Try again in a few minutes.</EmptyState>
        </Card>
      ) : stations.length === 0 ? (
        <Card>
          <EmptyState title={meal ? "Nothing matches your filters" : "No menu posted"}>
            {meal ? "Try removing a filter." : "This hall hasn't posted a menu for today."}
          </EmptyState>
        </Card>
      ) : (
        <div className={styles.grid}>
          {stations.map((s) => (
            <Section key={s.name}>
              <Card>
                <h2 className={styles.station}>{s.name}</h2>
                <ul className={styles.items}>
                  {s.items.map((item, i) => (
                    <li key={`${i}-${item.name}`}>
                      <a
                        className={styles.item}
                        href={item.labelUrl ?? undefined}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${item.name}, nutrition label`}
                      >
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.tags}>
                          {item.diets.includes("vegan") ? (
                            <span className={styles.diet}>Vegan</span>
                          ) : item.diets.includes("vegetarian") ? (
                            <span className={styles.diet}>Vegetarian</span>
                          ) : null}
                          {item.diets.includes("halal") ? <span className={styles.diet}>Halal</span> : null}
                          {item.contains.length ? (
                            <span className={styles.contains}>Contains {item.contains.join(", ")}</span>
                          ) : null}
                        </span>
                        <ExternalIcon className={styles.ext} />
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            </Section>
          ))}
        </div>
      )}
    </>
  );
}
