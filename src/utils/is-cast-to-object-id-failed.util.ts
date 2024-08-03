export const isCastToObjectIdFailed = (e: Error): boolean => {
  return e.toString().startsWith(`CastError: Cast to ObjectId failed for value`);
}