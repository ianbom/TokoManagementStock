<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\BusinessUpdateRequest;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\Business;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user()->load('business');

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'business' => $user->business?->only([
                'name',
                'owner_name',
                'address',
                'phone',
                'business_category',
            ]),
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();
        $storedPhoto = $request->file('photo_url')?->store("profiles/{$user->id}", 'public');

        if ($storedPhoto === false) {
            throw ValidationException::withMessages([
                'photo_url' => 'Foto profil gagal disimpan.',
            ]);
        }

        $previousPhoto = $user->photo_url;

        try {
            $user->fill([
                'name' => $validated['name'],
                ...(isset($validated['email']) ? ['email' => $validated['email']] : []),
                ...($storedPhoto === null ? [] : ['photo_url' => $storedPhoto]),
            ]);

            if (! empty($validated['password'])) {
                $user->password = $validated['password'];
            }

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            $user->save();
        } catch (Throwable $exception) {
            if ($storedPhoto !== null) {
                Storage::disk('public')->delete($storedPhoto);
            }

            throw $exception;
        }

        if ($storedPhoto !== null && $previousPhoto !== null) {
            Storage::disk('public')->delete($previousPhoto);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return to_route('profile.edit');
    }

    public function updateBusiness(BusinessUpdateRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request): void {
            $user = $request->user();
            $business = $user->business;

            if ($business === null) {
                $business = Business::create([
                    ...$request->validated(),
                    'code' => (string) Str::uuid(),
                    'business_type' => in_array($user->role, ['store', 'supplier'], true)
                        ? $user->role
                        : 'store',
                ]);

                $prefix = $business->business_type === 'supplier' ? 'SUP' : 'TOKO';
                $business->update([
                    'code' => sprintf('%s-%04d', $prefix, $business->id),
                ]);

                $user->business()->associate($business);
                $user->save();
            } else {
                $business->update($request->validated());
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Business data updated.')]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
