export function capitalizeFirstLetter(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function replaceUrlEncodeWithSpace(input: string): string {
  return input.replace(/%20/g, ' ');
}