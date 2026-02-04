# نظام العملات المتعدد - Multi-Currency System

## 📋 نظرة عامة

تم تطوير نظام عملات مركزي ومرن يتحكم في كافة الأسعار والمبالغ المالية في التطبيق.

## 🎯 الميزات الرئيسية

### 1. **إدارة العملات من الإعدادات**
- الذهاب إلى: `Settings > General Settings`
- يمكنك:
  - إضافة عملات جديدة
  - تحديد العملة الأساسية (Base Currency)
  - تعديل أسعار الصرف يدوياً
  - تفعيل التحديث التلقائي لأسعار الصرف

### 2. **العملات الافتراضية**
النظام يأتي مع العملات التالية مُعدّة مسبقاً:
- **USD** (دولار أمريكي) - $
- **IQD** (دينار عراقي) - ع.د
- **SAR** (ريال سعودي) - ر.س
- **EGP** (جنيه مصري) - ج.م
- **EUR** (يورو) - €

### 3. **تغيير العملة الافتراضية**
في صفحة الإعدادات العامة، يوجد قسم **"Default Display Currency"**:
- اختر العملة التي تريد عرض كافة الأسعار بها
- سيتم تحويل جميع المبالغ تلقائياً إلى العملة المختارة

### 4. **استخدام العملات في الحسابات**
عند إضافة حساب جديد في **Chart of Accounts**:
- حقل العملة (Currency) أصبح قائمة منسدلة
- تظهر فقط العملات المُفعّلة في الإعدادات
- العملة الافتراضية هي العملة الأساسية للنظام

## 🔧 للمطورين

### استخدام الـ Pipe في القوالب
```html
<!-- عرض المبلغ بالعملة الأساسية -->
<span>{{ amount | erpCurrency }}</span>

<!-- عرض المبلغ بعملة محددة -->
<span>{{ amount | erpCurrency:'IQD' }}</span>
```

### استخدام CurrencyService في الكود
```typescript
constructor(private currencyService: CurrencyService) {}

// الحصول على العملة الأساسية
const baseCurrency = this.currencyService.config.baseCurrency;

// تحويل مبلغ من عملة لأخرى
const convertedAmount = this.currencyService.convert(100, 'USD', 'IQD');

// الحصول على رمز عملة
const symbol = this.currencyService.getSymbol('IQD'); // ع.د
```

## 📊 سير العمل

1. **المستخدم يذهب للإعدادات** ويختار IQD كعملة أساسية
2. **النظام يحدّث تلقائياً**:
   - كل الأسعار في Chart of Accounts
   - كل التقارير المالية (P&L, Balance Sheet)
   - كل الفواتير والمبيعات (عند تطويرها)
3. **عند إضافة حساب جديد**:
   - القائمة المنسدلة للعملة تعرض فقط العملات المُفعّلة
   - العملة الافتراضية هي IQD

## ⚙️ الملفات المعدّلة

- `src/app/core/services/currency.service.ts` - الخدمة الرئيسية
- `src/app/shared/pipes/currency.pipe.ts` - Pipe لعرض العملات
- `src/app/modules/settings/general/general-settings.component.ts` - واجهة الإعدادات
- `src/app/modules/accounting/chart-of-accounts/chart-of-accounts.component.ts` - دليل الحسابات

## 🎨 مثال عملي

### قبل التعديل:
```typescript
// عملات ثابتة في الكود
options: [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' }
]
```

### بعد التعديل:
```typescript
// عملات ديناميكية من الإعدادات
options: this.currencyService.config.currencies.map(c => ({ 
  value: c.code, 
  label: `${c.code} - ${c.symbol}` 
}))
```

## 🚀 الخطوات القادمة

- [ ] ربط نظام العملات بفواتير المبيعات
- [ ] إضافة تقارير تحليلية بعملات متعددة
- [ ] دعم العملات الافتراضية (Cryptocurrencies)
- [ ] API خارجي لأسعار الصرف الحقيقية

---
**تم التطوير بواسطة**: Kimi Agent  
**التاريخ**: 2026-02-04
