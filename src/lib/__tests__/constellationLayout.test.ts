import { describe, expect, it } from "vitest";
import { CX, CY, fanAngles, hubRadius, moreCount, polar, textAnchor, truncate } from "../constellationLayout";

describe("polar", () => {
  it("places 0deg straight up from center", () => {
    const p = polar(CX, CY, 100, 0);
    expect(p.x).toBeCloseTo(CX);
    expect(p.y).toBeCloseTo(CY - 100);
  });

  it("places 90deg directly right of center", () => {
    const p = polar(CX, CY, 100, 90);
    expect(p.x).toBeCloseTo(CX + 100);
    expect(p.y).toBeCloseTo(CY);
  });
});

describe("textAnchor", () => {
  it("anchors start when the point is right of center", () => {
    expect(textAnchor(CX + 50)).toBe("start");
  });
  it("anchors end when the point is left of center", () => {
    expect(textAnchor(CX - 50)).toBe("end");
  });
  it("anchors middle within the dead zone", () => {
    expect(textAnchor(CX + 2)).toBe("middle");
  });
});

describe("hubRadius", () => {
  it("grows with a real count but stays clamped", () => {
    expect(hubRadius(0)).toBe(16);
    expect(hubRadius(19)).toBeCloseTo(16 + 19 * 0.22);
    expect(hubRadius(1000)).toBe(16 + 40); // clamped at cap
  });

  it("scales sensibly across this portfolio's real per-platform range (19-181)", () => {
    const small = hubRadius(19);
    const large = hubRadius(181);
    expect(large).toBeGreaterThan(small);
    expect(large).toBeLessThanOrEqual(16 + 40);
  });
});

describe("fanAngles", () => {
  it("returns nothing for zero items", () => {
    expect(fanAngles(0, 0, 60)).toEqual([]);
  });
  it("points a single leaf straight at the hub angle", () => {
    expect(fanAngles(45, 1, 60)).toEqual([45]);
  });
  it("spreads multiple leaves symmetrically around the hub angle", () => {
    const angles = fanAngles(0, 3, 60);
    expect(angles.length).toBe(3);
    expect(angles[1]).toBeCloseTo(0);
    expect(angles[0]).toBeLessThan(angles[1]);
    expect(angles[2]).toBeGreaterThan(angles[1]);
  });
});

describe("truncate", () => {
  it("leaves short strings alone", () => {
    expect(truncate("abc", 10)).toBe("abc");
  });
  it("truncates with an ellipsis at the limit", () => {
    expect(truncate("abcdefghij", 5)).toBe("abcd…");
  });
});

describe("moreCount", () => {
  it("is zero when nothing real remains", () => {
    expect(moreCount(5, 5)).toBe(0);
    expect(moreCount(3, 5)).toBe(0);
  });
  it("reports the real remainder", () => {
    expect(moreCount(153, 5)).toBe(148);
  });
});
