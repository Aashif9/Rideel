import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:rideel/core/theme/app_theme.dart';
import 'package:rideel/providers/auth_provider.dart';
import 'package:rideel/providers/sender_provider.dart';
import 'package:rideel/providers/traveler_provider.dart';
import 'package:rideel/routing/router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final authProvider = AuthProvider();
  await authProvider.init();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: authProvider),
        ChangeNotifierProvider(create: (_) => SenderProvider()),
        ChangeNotifierProvider(create: (_) => TravelerProvider()),
      ],
      child: RideelApp(authProvider: authProvider),
    ),
  );
}

class RideelApp extends StatefulWidget {
  final AuthProvider authProvider;
  const RideelApp({super.key, required this.authProvider});

  @override
  State<RideelApp> createState() => _RideelAppState();
}

class _RideelAppState extends State<RideelApp> {
  late final GoRouter _router;

  @override
  void initState() {
    super.initState();
    _router = AppRouter.createRouter(widget.authProvider);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Rideel',
      theme: AppTheme.lightTheme,
      routerConfig: _router,
      debugShowCheckedModeBanner: false,
    );
  }
}
