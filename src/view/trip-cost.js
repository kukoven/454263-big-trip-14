const createTripCostTemplate = (points) => {
  let totalCost = 0;

  points.forEach((currentValue) => {
    totalCost += currentValue.basePrice;
  });

  return `
  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
  </p>
  `;
};

export {createTripCostTemplate};
