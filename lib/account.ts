export const CUSTOMER_PATTERN = /^\d{6}$/;
export const LOCATION_PATTERN = /^\d{5}$/;

export function isCustomerNumber(value: string) {
  return CUSTOMER_PATTERN.test(value);
}

export function isLocationNumber(value: string) {
  return LOCATION_PATTERN.test(value);
}

export function accountPath(customerNumber: string, locationNumber: string) {
  return `/accounts/${customerNumber}/${locationNumber}`;
}

export function employeePath(
  customerNumber: string,
  locationNumber: string,
  employeeId: string
) {
  return `${accountPath(customerNumber, locationNumber)}/employees/${employeeId}`;
}

export function exportPath(customerNumber: string, locationNumber: string) {
  return `${accountPath(customerNumber, locationNumber)}/export`;
}

export function mockScanPath(
  scan: "sizing" | "face-pd",
  customerNumber: string,
  locationNumber: string,
  employeeId: string
) {
  const params = new URLSearchParams({
    customer: customerNumber,
    location: locationNumber,
    employeeId,
  });
  return `/scans/${scan}?${params.toString()}`;
}
