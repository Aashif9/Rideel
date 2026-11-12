import 'package:go_router/go_router.dart';
import 'package:rideel/providers/auth_provider.dart';
import 'package:rideel/screens/splash/splash_screen.dart';
import 'package:rideel/screens/onboarding/onboarding_screen.dart';
import 'package:rideel/screens/auth/login_screen.dart';
import 'package:rideel/screens/auth/otp_screen.dart';
import 'package:rideel/screens/auth/role_selection_screen.dart';
import 'package:rideel/screens/sender/sender_dashboard.dart';
import 'package:rideel/screens/sender/create_parcel_screen.dart';
import 'package:rideel/screens/sender/available_travelers_screen.dart';
import 'package:rideel/screens/sender/traveler_profile_screen.dart';
import 'package:rideel/screens/sender/booking_confirmation_screen.dart';
import 'package:rideel/screens/sender/my_deliveries_screen.dart';
import 'package:rideel/screens/sender/delivery_details_screen.dart';
import 'package:rideel/screens/sender/live_tracking_screen.dart';
import 'package:rideel/screens/traveler/traveler_dashboard.dart';
import 'package:rideel/screens/traveler/create_trip_screen.dart';
import 'package:rideel/screens/traveler/delivery_requests_screen.dart';
import 'package:rideel/screens/traveler/request_details_screen.dart';
import 'package:rideel/screens/traveler/my_trips_screen.dart';
import 'package:rideel/screens/traveler/trip_details_screen.dart';
import 'package:rideel/screens/profile/profile_screen.dart';
import 'package:rideel/screens/profile/edit_profile_screen.dart';
import 'package:rideel/screens/wallet/wallet_screen.dart';
import 'package:rideel/screens/notifications/notifications_screen.dart';
import 'package:rideel/screens/settings/settings_screen.dart';
import 'package:rideel/screens/settings/help_screen.dart';

class AppRouter {
  static GoRouter createRouter(AuthProvider auth) {
    return GoRouter(
      initialLocation: '/splash',
      refreshListenable: auth,
      redirect: (context, state) {
        final loggedIn = auth.isLoggedIn;
        final role = auth.userRole;
        final loc = state.matchedLocation;

        final isAuthRoute = loc == '/splash' ||
            loc == '/onboarding' ||
            loc == '/login' ||
            loc == '/otp' ||
            loc == '/role-selection';

        if (loggedIn && role.isNotEmpty && isAuthRoute) {
          return '/$role/dashboard';
        }
        if (loggedIn && role.isEmpty && loc != '/role-selection') {
          return '/role-selection';
        }
        return null;
      },
      routes: [
        GoRoute(path: '/splash', builder: (c, s) => const SplashScreen()),
        GoRoute(path: '/onboarding', builder: (c, s) => const OnboardingScreen()),
        GoRoute(path: '/login', builder: (c, s) => const LoginScreen()),
        GoRoute(
          path: '/otp',
          builder: (c, s) {
            final phone = (s.extra as String?) ??
                s.uri.queryParameters['phone'] ??
                '';
            return OtpScreen(phone: phone);
          },
        ),
        GoRoute(path: '/role-selection', builder: (c, s) => const RoleSelectionScreen()),
        GoRoute(path: '/sender/dashboard', builder: (c, s) => const SenderDashboard()),
        GoRoute(path: '/sender/create-parcel', builder: (c, s) => const CreateParcelScreen()),
        GoRoute(path: '/sender/available-travelers', builder: (c, s) => const AvailableTravelersScreen()),
        GoRoute(path: '/sender/traveler-profile', builder: (c, s) => const TravelerProfileScreen()),
        GoRoute(path: '/sender/booking-confirmation', builder: (c, s) => const BookingConfirmationScreen()),
        GoRoute(path: '/sender/my-deliveries', builder: (c, s) => const MyDeliveriesScreen()),
        GoRoute(
          path: '/sender/delivery-details',
          builder: (c, s) => DeliveryDetailsScreen(delivery: s.extra as dynamic),
        ),
        GoRoute(path: '/sender/live-tracking', builder: (c, s) => const LiveTrackingScreen()),
        GoRoute(path: '/traveler/dashboard', builder: (c, s) => const TravelerDashboard()),
        GoRoute(path: '/traveler/create-trip', builder: (c, s) => const CreateTripScreen()),
        GoRoute(path: '/traveler/delivery-requests', builder: (c, s) => const DeliveryRequestsScreen()),
        GoRoute(path: '/traveler/request-details', builder: (c, s) => const RequestDetailsScreen()),
        GoRoute(path: '/traveler/my-trips', builder: (c, s) => const MyTripsScreen()),
        GoRoute(path: '/traveler/trip-details', builder: (c, s) => const TripDetailsScreen()),
        GoRoute(path: '/profile', builder: (c, s) => const ProfileScreen()),
        GoRoute(path: '/edit-profile', builder: (c, s) => const EditProfileScreen()),
        GoRoute(path: '/wallet', builder: (c, s) => const WalletScreen()),
        GoRoute(path: '/notifications', builder: (c, s) => const NotificationsScreen()),
        GoRoute(path: '/settings', builder: (c, s) => const SettingsScreen()),
        GoRoute(path: '/help', builder: (c, s) => const HelpScreen()),
      ],
    );
  }
}
