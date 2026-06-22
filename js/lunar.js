/**
 * lunar.js — 음력↔양력 간이 변환
 * 설날(음력 1월 1일) 양력 날짜 기준으로 음력→양력 근사 변환
 */

// 설날 (양력 월, 일) 1930~2030
const LUNAR_NEW_YEAR = {
  1930:[1,30],1931:[2,17],1932:[2,6], 1933:[1,26],1934:[2,14],
  1935:[2,4], 1936:[1,24],1937:[2,11],1938:[1,31],1939:[2,19],
  1940:[2,8], 1941:[1,27],1942:[2,15],1943:[2,5], 1944:[1,25],
  1945:[2,13],1946:[2,2], 1947:[1,22],1948:[2,10],1949:[1,29],
  1950:[2,17],1951:[2,6], 1952:[1,27],1953:[2,14],1954:[2,3],
  1955:[1,24],1956:[2,12],1957:[1,31],1958:[2,18],1959:[2,8],
  1960:[1,28],1961:[2,15],1962:[2,5], 1963:[1,25],1964:[2,13],
  1965:[2,2], 1966:[1,21],1967:[2,9], 1968:[1,30],1969:[2,17],
  1970:[2,6], 1971:[1,27],1972:[2,15],1973:[2,3], 1974:[1,23],
  1975:[2,11],1976:[1,31],1977:[2,18],1978:[2,7], 1979:[1,28],
  1980:[2,16],1981:[2,5], 1982:[1,25],1983:[2,13],1984:[2,2],
  1985:[2,20],1986:[2,9], 1987:[1,29],1988:[2,17],1989:[2,6],
  1990:[1,27],1991:[2,15],1992:[2,4], 1993:[1,23],1994:[2,10],
  1995:[1,31],1996:[2,19],1997:[2,7], 1998:[1,28],1999:[2,16],
  2000:[2,5], 2001:[1,24],2002:[2,12],2003:[2,1], 2004:[1,22],
  2005:[2,9], 2006:[1,29],2007:[2,18],2008:[2,7], 2009:[1,26],
  2010:[2,14],2011:[2,3], 2012:[1,23],2013:[2,10],2014:[1,31],
  2015:[2,19],2016:[2,8], 2017:[1,28],2018:[2,16],2019:[2,5],
  2020:[1,25],2021:[2,12],2022:[2,1], 2023:[1,22],2024:[2,10],
  2025:[1,29],2026:[2,17],2027:[2,6], 2028:[1,26],2029:[2,13],
  2030:[2,3]
};

/**
 * 음력 → 양력 근사 변환
 * @param {number} ly 음력 연도
 * @param {number} lm 음력 월 (1~12)
 * @param {number} ld 음력 일
 * @param {boolean} isLeap 윤달 여부
 * @returns {{year,month,day}|null}
 */
function lunarToSolar(ly, lm, ld, isLeap=false) {
  const base = LUNAR_NEW_YEAR[ly];
  if (!base) return null;

  const newYear = new Date(ly, base[0]-1, base[1]);
  // 음력 1개월 ≈ 29.5일
  let days = (lm - 1) * 29.5 + (ld - 1);
  if (isLeap) days += 29.5;

  const solar = new Date(newYear.getTime() + days * 86400000);
  return { year: solar.getFullYear(), month: solar.getMonth()+1, day: solar.getDate() };
}

/**
 * 양력 → 음력 근사 변환 (손없는날 계산용)
 */
function solarToLunar(sy, sm, sd) {
  const solar = new Date(sy, sm - 1, sd);
  let lunarYear = sy;
  let nyArr = LUNAR_NEW_YEAR[sy];
  if (!nyArr) return null;
  let newYear = new Date(sy, nyArr[0] - 1, nyArr[1]);

  if (solar < newYear) {
    lunarYear = sy - 1;
    nyArr = LUNAR_NEW_YEAR[lunarYear];
    if (!nyArr) return null;
    newYear = new Date(lunarYear, nyArr[0] - 1, nyArr[1]);
  }

  const diffDays = Math.floor((solar - newYear) / 86400000);
  const lunarMonth = Math.floor(diffDays / 29.5) + 1;
  const lunarDay   = Math.round(diffDays % 29.5) + 1;
  return { year: lunarYear, month: Math.min(12, lunarMonth), day: Math.min(30, Math.max(1, lunarDay)) };
}

window.LunarCalendar = { lunarToSolar, solarToLunar };
