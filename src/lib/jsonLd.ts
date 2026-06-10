/**
 * Tipo para datos estructurados JSON-LD (schema.org).
 *
 * El index signature `[key: string]: unknown` permite acceso dinámico a
 * propiedades específicas de cada schema (Person, BlogPosting, CreativeWork, etc.)
 * y mutación controlada al construir el objeto.
 *
 * `@type: string` da una pista mínima de qué se espera. Para type safety
 * completo contra schema.org, considerar `schema-dts` (overhead de bundle
 * no justificado para los 4 jsonLd objects del portfolio).
 */
export interface JsonLd {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}
