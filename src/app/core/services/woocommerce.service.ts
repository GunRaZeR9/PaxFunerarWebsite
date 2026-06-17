import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WcProduct, WcCategory, WcOrderPayload, WcOrder } from '../models/woocommerce.models';

@Injectable({ providedIn: 'root' })
export class WooCommerceService {
  private readonly http = inject(HttpClient);

  private get authParams(): HttpParams {
    return new HttpParams()
      .set('consumer_key', environment.wcConsumerKey)
      .set('consumer_secret', environment.wcConsumerSecret);
  }

  getProducts(params: {
    category?: string;
    per_page?: number;
    page?: number;
  } = {}): Observable<WcProduct[]> {
    let httpParams = this.authParams
      .set('per_page', params.per_page ?? 50)
      .set('page', params.page ?? 1)
      .set('status', 'publish');

    if (params.category) {
      httpParams = httpParams.set('category', params.category);
    }

    return this.http.get<WcProduct[]>(`${environment.wcApiUrl}/products`, { params: httpParams });
  }

  getProduct(id: number): Observable<WcProduct> {
    return this.http.get<WcProduct>(`${environment.wcApiUrl}/products/${id}`, {
      params: this.authParams,
    });
  }

  getCategories(): Observable<WcCategory[]> {
    return this.http.get<WcCategory[]>(`${environment.wcApiUrl}/products/categories`, {
      params: this.authParams.set('per_page', 50),
    });
  }

  parsePrice(product: WcProduct): number {
    return parseFloat(product.price || product.regular_price || '0');
  }

  createOrder(payload: WcOrderPayload): Observable<WcOrder> {
    return this.http.post<WcOrder>(`${environment.proxyUrl}?action=create_order`, payload);
  }

  getOrder(orderId: number): Observable<WcOrder> {
    return this.http.get<WcOrder>(
      `${environment.proxyUrl}?action=get_order&order_id=${orderId}`,
    );
  }
}
