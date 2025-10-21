
const FORBIDDEN_FIELDS = ["password"];

export function buildPrismaQuery(query: any){
  // Pagination
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;

  let orderBy: any = undefined;

  // Sorting
  if (query.sort) {
    const fields = query.sort.split(",");
    orderBy = fields.map((field: string) =>
      field.startsWith("-")
        ? { [field.substring(1)]: "desc" }
        : { [field]: "asc" }
    );
  }

  // Limiting
  let select: any = undefined;
  if (query.fields) {
    const fields = query.fields.split(",");
    const safeFields = fields.filter(
      (f: string) => !FORBIDDEN_FIELDS.includes(f.trim())
    );
    select = safeFields.reduce((acc: any, field: string) => {
      acc[field.trim()] = true;
      return acc;
    }, {});
  }
  return { skip, take: limit, orderBy, select };
}