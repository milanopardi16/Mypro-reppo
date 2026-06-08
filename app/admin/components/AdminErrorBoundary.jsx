'use client'

import { Component } from 'react'

export default class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="admin-error" role="alert">
          <strong>خطایی رخ داد.</strong>
          <div style={{ marginTop: 8, fontSize: 13 }}>
            {this.state.error?.message || 'لطفاً صفحه را مجدداً بارگذاری کنید.'}
          </div>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            style={{ marginTop: 12 }}
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            تلاش مجدد
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
