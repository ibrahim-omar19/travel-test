interface DataLayerObject {
  event: string;
  data: object;
}

interface Window {
  adsbygoogle: { [key: string]: unknown }[];
  MediaAlphaExchange: {
    data: {
      add_car: number;
      add_hotel: number;
      flexible_dates: number;
      flights: {
        origin: string | string[];
        destination: string | string[];
        date: string;
        time: string;
      }[];
      max_stops: number;
      nearby_airports: number;
      num_adults: number;
      num_children: number;
      num_infants_in_lap: number;
      num_infants_in_seat: number;
      num_seniors: number;
      preferred_airlines: string[];
      preferred_cabin_class: string;
      refundable_fare: number;
    };
    locale: string;
    placement_id: string[];
    sub_1?: string;
    sub_2?: string;
    sub_3?: string;
    type: 'ad_unit';
    version: '17';
    callbacks?: {
      success?: (numAds: number, targetID: string) => void;
      error?: () => void;
      search?: (data) => void;
      search_error?: () => void;
      click?: (data) => void;
    };
  };
  MediaAlphaExchange__load: (config: any) => void;
  dataLayer: DataLayerObject[] | function;
}
