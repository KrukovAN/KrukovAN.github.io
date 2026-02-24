export type Category = {
  id: string;
  name: string;
  photo?: string;
};

export type Product = {
  id: string;
  name: string;
  photo: string;
  desc?: string;
  createdAt: string;
  oldPrice?: number;
  price: number;
  category: Category;
};

export type OperationBase = {
  id: string;
  name: string;
  desc?: string;
  createdAt: string;
  amount: number;
  category: Category;
};

export type Cost = OperationBase & { type: 'Cost' };
export type Profit = OperationBase & { type: 'Profit' };

export type Operation = Cost | Profit;

/* ---------------- helpers ---------------- */

const pick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const chance = (p: number): boolean => Math.random() < p;

const randomMoney = (min: number, max: number): number => Math.round((Math.random() * (max - min) + min) * 100) / 100;

const randomId = (prefix = ''): string => {
  const s1 = Math.random().toString(36).slice(2, 10);
  const s2 = Date.now().toString(36);
  return `${prefix}${s2}_${s1}`;
};

const photoUrl = (seed: string, w = 640, h = 480): string =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const maybeDesc = (): string | undefined => {
  if (!chance(0.5)) return undefined;
  return pick([
    'Без лишних деталей.',
    'Срочно/по пути домой.',
    'Акция/скидка применена.',
    'Плановая покупка.',
    'Рекомендовано друзьями.',
  ] as const);
};

/* ---------------- categories ---------------- */

export const CATEGORIES = [
  { id: 'cat_food', name: 'Еда', photo: photoUrl('cat_food', 200, 200) },
  { id: 'cat_tech', name: 'Техника', photo: photoUrl('cat_tech', 200, 200) },
  { id: 'cat_clothes', name: 'Одежда' },
  { id: 'cat_home', name: 'Дом', photo: photoUrl('cat_home', 200, 200) },
  { id: 'cat_transport', name: 'Транспорт' },
  { id: 'cat_fun', name: 'Развлечения' },
  { id: 'cat_health', name: 'Здоровье' },
  { id: 'cat_gifts', name: 'Подарки' },
  { id: 'cat_edu', name: 'Образование' },
  { id: 'cat_subs', name: 'Подписки' },
] as const satisfies readonly Category[];

const createRandomCategory = (): Category => {
  const cat = pick(CATEGORIES);
  return { ...cat };
};

/* ---------------- data generators ---------------- */

const PRODUCT_NAMES = [
  'Кофе',
  'Наушники',
  'Футболка',
  'Лампа',
  'Такси',
  'Книга',
  'Пылесос',
  'Мышь',
  'Шампунь',
  'Рюкзак',
] as const;

const OP_COST_NAMES = [
  'Покупка продуктов',
  'Проезд',
  'Подписка',
  'Кафе',
  'Аптека',
  'Одежда',
  'Домашние товары',
  'Подарок',
] as const;

const OP_PROFIT_NAMES = ['Зарплата', 'Возврат', 'Фриланс', 'Кэшбек', 'Продажа вещи', 'Подарили деньги'] as const;

export const createRandomProduct = (createdAt: string): Product => {
  const id = randomId('prd_');
  const category = createRandomCategory();

  const price = randomMoney(2, 499);
  const oldPrice = chance(0.35) ? Math.max(price + randomMoney(1, 120), price) : undefined;

  return {
    id,
    name: pick(PRODUCT_NAMES),
    photo: photoUrl(id, 640, 480),
    desc: maybeDesc(),
    createdAt,
    oldPrice,
    price,
    category,
  };
};

export const createRandomOperation = (createdAt: string): Operation => {
  const isProfit = chance(0.5);
  const id = randomId(isProfit ? 'prf_' : 'cst_');
  const category = createRandomCategory();

  const amount = isProfit ? randomMoney(10, 6000) : randomMoney(1, 1200);

  return isProfit
    ? {
        id,
        name: pick(OP_PROFIT_NAMES),
        desc: maybeDesc(),
        createdAt,
        amount,
        category,
        type: 'Profit',
      }
    : {
        id,
        name: pick(OP_COST_NAMES),
        desc: maybeDesc(),
        createdAt,
        amount,
        category,
        type: 'Cost',
      };
};
