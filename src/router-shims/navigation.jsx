import { useLocation, useNavigate, useParams } from 'react-router-dom'

export function useRouter() {
  const navigate = useNavigate()
  return {
    push: (to) => navigate(to),
    replace: (to) => navigate(to, { replace: true }),
    back: () => navigate(-1),
    refresh: () => window.location.reload(),
  }
}

export function usePathname() {
  const location = useLocation()
  return location.pathname
}

export function useSearchParams() {
  const location = useLocation()
  return new URLSearchParams(location.search)
}

export function useParamsShim() {
  return useParams()
}
